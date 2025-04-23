import React from 'react';
import { format, isBefore, startOfToday } from 'date-fns';
import { X, Plus } from 'lucide-react';
import { CalendarDay, Task } from '../../types';
import TaskItem from './TaskItem';
import { useAuth } from '../../context/useAuth';

interface TaskModalProps {
  day: CalendarDay;
  onClose: () => void;
  onAddTask: () => void;
  onTaskClick: (task: Task, e: React.MouseEvent) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ day, onClose, onAddTask, onTaskClick }) => {
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {format(day.date, 'EEEE, MMMM d, yyyy')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          {day.tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tasks for this day
            </div>
          ) : (
            <div className="space-y-3">
              {day.tasks.map(task => (
                <TaskItem 
                  key={task._id} 
                  task={task} 
                  onClick={(e) => onTaskClick(task, e)} 
                />
              ))}
            </div>
          )}
        </div>
        
        {isManager && !isBefore(day.date,startOfToday()) && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onAddTask}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition"
            >
              <Plus size={18} />
              <span>Add Task</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;