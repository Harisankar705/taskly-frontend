import React, { useState, useEffect } from 'react';
import { taskApi } from '../api';
import { Task } from '../types';
import TaskItem from '../components/tasks/TaskItem';
import TaskForm from '../components/tasks/TaskForm';
import { Plus, Filter } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await taskApi.getTasks();
      console.log(response)
      setTasks(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...tasks];
    
    if (filters.status !== 'all') {
      result = result.filter(task => task.status === filters.status);
    }
    
    if (filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }
    
    setFilteredTasks(result);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        
        <div className="flex gap-3">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>
          
          {isManager && (
            <button
              onClick={handleAddTask}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              <Plus size={18} />
              <span>Add Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {isFilterOpen && (
        <div className="bg-white p-4 rounded-lg shadow-sm animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Statuses</option>
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
                value={filters.priority}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Filter size={24} className="text-gray-400" />
            </div>
            <p>No tasks found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map(task => (
              <div key={task._id} onClick={() => handleTaskClick(task)}>
                <TaskItem task={task} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task form modal */}
      {isFormOpen && (
        <TaskForm
          selectedDate={selectedTask ? new Date(selectedTask.date) : new Date()}
          task={selectedTask}
          onClose={() => setIsFormOpen(false)}
          onSave={() => {
            setIsFormOpen(false);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
};

export default TasksPage;