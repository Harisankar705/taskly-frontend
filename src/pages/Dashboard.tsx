import React, { useEffect, useState } from 'react';
import { taskApi } from '../api';
import { Task } from '../types';
import { format, isToday, isFuture } from 'date-fns';
import { Calendar, CheckSquare, Clock, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TaskItem from '../components/tasks/TaskItem';
import { useAuth } from '../context/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskApi.getTasks();
        setTasks(response);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return isToday(taskDate);
  });

  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return isFuture(taskDate);
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const StatusCard = ({ title, count, icon, color }: { title: string; count: number; icon: React.ReactNode; color: string }) => (
    <div className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome back, {user?.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard 
          title="Pending" 
          count={pendingTasks.length} 
          icon={<Clock size={24} className="text-status-pending" />} 
          color="border-status-pending" 
        />
        <StatusCard 
          title="In Progress" 
          count={inProgressTasks.length} 
          icon={<Clock size={24} className="text-status-in-progress" />} 
          color="border-status-in-progress" 
        />
        <StatusCard 
          title="Completed" 
          count={completedTasks.length} 
          icon={<CheckSquare size={24} className="text-status-completed" />} 
          color="border-status-completed" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <CalendarIcon size={20} className="mr-2 text-primary" />
                Today's Tasks
              </h2>
              <Link to="/calendar" className="text-primary hover:text-primary-dark text-sm flex items-center">
                View Calendar
                <ChevronRight size={16} />
              </Link>
            </div>
            
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={40} className="mx-auto mb-2 text-gray-400" />
                <p>No tasks scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.map(task => (
                  <TaskItem key={task._id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Calendar size={20} className="mr-2 text-primary" />
                Upcoming Tasks
              </h2>
              <Link to="/tasks" className="text-primary hover:text-primary-dark text-sm flex items-center">
                View All
                <ChevronRight size={16} />
              </Link>
            </div>
            
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={40} className="mx-auto mb-2 text-gray-400" />
                <p>No upcoming tasks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <div key={task._id} className="border-b border-gray-100 pb-3 last:border-0">
                    <p className="font-medium text-gray-800">{task.taskName}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {format(new Date(task.date), 'MMM d, yyyy')}
                      </span>
                      <span 
                        className={`px-2 py-0.5 rounded-full text-xs
                          ${task.priority === 'high' 
                            ? 'bg-priority-high/10 text-priority-high' 
                            : task.priority === 'medium'
                            ? 'bg-priority-medium/10 text-priority-medium'
                            : 'bg-priority-low/10 text-priority-low'
                          }`
                        }
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;