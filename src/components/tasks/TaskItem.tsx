import React from 'react';
import { format } from 'date-fns';
import { Task } from '../../types';

interface TaskItemProps {
  task: Task;
  onClick?: (e: React.MouseEvent) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-status-pending/10 text-status-pending border-status-pending';
      case 'in-progress':
        return 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress';
      case 'completed':
        return 'bg-status-completed/10 text-status-completed border-status-completed';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-priority-high/10 text-priority-high';
      case 'medium':
        return 'bg-priority-medium/10 text-priority-medium';
      case 'low':
        return 'bg-priority-low/10 text-priority-low';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const assignedToName = typeof task.assignedTo === 'string' 
    ? 'Unknown' 
    : task.assignedTo.name;

  

  return (
    <div 
      className="border border-gray-200 rounded-lg p-3 hover:border-primary/50 cursor-pointer transition shadow-sm hover:shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-800">{task.taskName}</h4>
        <div className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(task.status)}`}>
          {task.status}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-2">
        <div className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </div>
        <div className="text-xs px-2 py-1 bg-cream/50 text-accent rounded-full">
          {format(new Date(task.date), 'MMM d, yyyy')}
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>To: {assignedToName}</span>
      </div>
    </div>
  );
};

export default TaskItem;