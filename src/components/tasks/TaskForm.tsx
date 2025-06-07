import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { taskApi, userApi } from '../../api';
import { Task, User } from '../../types';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/useAuth';

interface TaskFormProps {
  selectedDate: Date;
  task: Task | null;
  onClose: () => void;
  onSave: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ selectedDate, task, onClose, onSave }) => {
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';
  const isEditMode = !!task;
  
  const [employees, setEmployees] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    assignedTo: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
    status: 'pending',
    priority: 'medium',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await userApi.getEmployees();
        setEmployees(response);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    if (isManager) {
      fetchEmployees();
    }
  }, [isManager]);

  useEffect(() => {
    if (task) {
      setFormData({
        taskName: task.taskName,
        description: task.description,
        assignedTo: typeof task.assignedTo === 'string' ? task.assignedTo : task.assignedTo._id,
        date: format(new Date(task.date), 'yyyy-MM-dd'),
        status: task.status,
        priority: task.priority,
      });
    }
  }, [task]);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  
  if (name === 'taskName' || name === 'description') {
    if (value && value.startsWith(' ')) {
      e.target.value = value.trimStart();
    }
  }
  
  setFormData(prev => ({ ...prev, [name]: e.target.value }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const trimmedTaskName=formData.taskName.trim()
    const trimmedDescription=formData.description.trim()
    if(trimmedTaskName.length===0)
    {
      toast.error("Taskname cannot be empty!")
      setIsLoading(false)
      return
    }
    if(trimmedDescription.length===0)
    {
      toast.error("Description cannot be empty!")
      setIsLoading(false)
      return
    }
    
    try {
      const payload={
        ...formData,
        taskName:trimmedTaskName,
        description:trimmedDescription
      }
      if (isEditMode && task) {
        await taskApi.updateTask(task._id, payload);
        toast.success('Task updated successfully');
      } else {
        await taskApi.createTask(payload);
        toast.success('Task created successfully');
      }
      onSave();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsLoading(true);
      
      try {
        await taskApi.deleteTask(task._id);
        toast.success('Task deleted successfully');
        onSave();
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      } finally {
        setIsLoading(false);
      }
    }
  };
 

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] flex flex-col animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-1">
                Task Name
              </label>
              <input
                type="text"
                id="taskName"
                name="taskName"
                value={formData.taskName}
                onChange={handleChange}
                required
                disabled={!isManager}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={!isManager}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            {isManager && (
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  required
                  disabled={!isManager}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select Employee</option>
                  {employees.map(employee => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                 Date of submission
              </label>
              <input
                type="date"
                id="date"
                disabled={!isManager}
                name="date"
                min={format(new Date(),'yyyy-MM-dd')}
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  disabled={!isManager}
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            {isEditMode && isManager && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            )}
            
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;