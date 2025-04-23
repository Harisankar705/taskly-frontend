import React, { useState, useEffect } from 'react';
import { userApi, taskApi } from '../api';
import { User, Task } from '../types';
import { Users, UserCheck, CheckSquare, Calendar, ChevronRight, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const EmployeesPage: React.FC = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';
  
  const [employees, setEmployees] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);

  useEffect(() => {
    if (!isManager) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [employeesRes, tasksRes] = await Promise.all([
          userApi.getEmployees(),
          taskApi.getTasks(),
        ]);
        
        setEmployees(employeesRes);
        setTasks(tasksRes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isManager]);

  if (!isManager) {
    return <Navigate to="/dashboard" />;
  }

  const getEmployeeTasks = (employeeId: string) => {
    return tasks.filter(task => {
      const assignedTo = typeof task.assignedTo === 'string' 
        ? task.assignedTo 
        : task.assignedTo._id;
      
      return assignedTo === employeeId;
    });
  };

  const getTaskStatusCounts = (employeeId: string) => {
    const employeeTasks = getEmployeeTasks(employeeId);
    
    return {
      total: employeeTasks.length,
      pending: employeeTasks.filter(task => task.status === 'pending').length,
      inProgress: employeeTasks.filter(task => task.status === 'in-progress').length,
      completed: employeeTasks.filter(task => task.status === 'completed').length,
    };
  };

  const toggleExpand = (employeeId: string) => {
    if (expandedEmployee === employeeId) {
      setExpandedEmployee(null);
    } else {
      setExpandedEmployee(employeeId);
    }
  };

  const TaskStatusCard = ({ title, count, total, icon, color }: { 
    title: string; 
    count: number; 
    total: number;
    icon: React.ReactNode; 
    color: string;
  }) => (
    <div className={`bg-white rounded-lg p-3 border-l-3 ${color}`}>
      <div className="flex items-center">
        <div className="mr-3">{icon}</div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          <div className="flex items-baseline gap-1">
            <p className="text-lg font-bold text-gray-900">{count}</p>
            <span className="text-xs text-gray-500">/ {total}</span>
          </div>
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
      <h1 className="text-2xl font-bold text-gray-800">Manage Employees</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Users size={24} className="text-primary" />
            <h2 className="text-lg font-semibold text-gray-800">
              Team Members ({employees.length})
            </h2>
          </div>
        </div>

        {employees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Users size={24} className="text-gray-400" />
            </div>
            <p>No employees found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {employees.map(employee => {
              const taskCounts = getTaskStatusCounts(employee._id);
              const employeeTasks = getEmployeeTasks(employee._id);
              const isExpanded = expandedEmployee === employee._id;
              
              return (
                <li key={employee._id} className="p-4 hover:bg-gray-50">
                  <div 
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => toggleExpand(employee._id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {employee.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{employee.name}</h3>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <CheckSquare size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {taskCounts.total} Tasks
                        </span>
                      </div>
                      
                      <button 
                        className="text-gray-400 p-1 rounded-full hover:bg-gray-100"
                      >
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 animate-slide-down">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <TaskStatusCard 
                          title="Pending" 
                          count={taskCounts.pending} 
                          total={taskCounts.total}
                          icon={<Calendar size={18} className="text-status-pending" />} 
                          color="border-status-pending" 
                        />
                        <TaskStatusCard 
                          title="In Progress" 
                          count={taskCounts.inProgress} 
                          total={taskCounts.total}
                          icon={<Calendar size={18} className="text-status-in-progress" />} 
                          color="border-status-in-progress" 
                        />
                        <TaskStatusCard 
                          title="Completed" 
                          count={taskCounts.completed} 
                          total={taskCounts.total}
                          icon={<UserCheck size={18} className="text-status-completed" />} 
                          color="border-status-completed" 
                        />
                      </div>
                      
                      <div className="mt-3 border-t border-gray-100 pt-3">
                        <h4 className="font-medium text-gray-700 mb-2">Recent Tasks</h4>
                        {employeeTasks.length === 0 ? (
                          <p className="text-sm text-gray-500">No tasks assigned yet</p>
                        ) : (
                          <div className="space-y-2">
                            {employeeTasks.slice(0, 3).map(task => (
                              <div key={task._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <div>
                                  <p className="font-medium text-gray-800">{task.taskName}</p>
                                  <p className="text-xs text-gray-500">
                                    {format(new Date(task.date), 'MMM d, yyyy')}
                                  </p>
                                </div>
                                <div 
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    task.status === 'pending'
                                      ? 'bg-status-pending/10 text-status-pending'
                                      : task.status === 'in-progress'
                                      ? 'bg-status-in-progress/10 text-status-in-progress'
                                      : 'bg-status-completed/10 text-status-completed'
                                  }`}
                                >
                                  {task.status}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;