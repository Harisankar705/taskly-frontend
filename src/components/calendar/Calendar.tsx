import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { CalendarDay, Task } from '../../types';
import TaskModal from '../tasks/TaskModal';
import { taskApi } from '../../api';
import TaskForm from '../tasks/TaskForm';
import { useAuth } from '../../context/useAuth';

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
      const response = await taskApi.getTasks();
        setTasks(response);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [currentDate]);

  useEffect(() => {
    const firstDay = startOfMonth(currentDate);
    const lastDay = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });

    const days: CalendarDay[] = daysInMonth.map(date => {
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return isSameDay(taskDate, date);
      });

      return {
        date,
        isCurrentMonth: isSameMonth(date, currentDate),
        isToday: isToday(date),
        tasks: dayTasks
      };
    });

    setCalendarDays(days);
  }, [currentDate, tasks]);

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
    setIsTaskModalOpen(true);
  };

  const handleTaskClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const handleAddTask = (day: CalendarDay) => {
    setSelectedDay(day);
    setSelectedTask(null);
    setIsTaskFormOpen(true);
  };

  const refreshTasks = async () => {
    try {
      const response = await taskApi.getTasks();
      setTasks(response);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    }
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={prevMonth}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="px-3 py-1 rounded-md bg-primary text-white hover:bg-primary-dark"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={nextMonth}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div key={day} className="text-sm font-medium text-gray-500 text-center py-2">
            {day}
          </div>
        ))}

        {calendarDays.map((day, i) => (
          <div
            key={i}
            onClick={() => handleDayClick(day)}
            className={`min-h-[100px] p-2 border rounded-md cursor-pointer transition hover:border-primary/50 ${
              day.isToday ? 'bg-primary/5 border-primary' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <span
                className={`text-sm font-medium ${
                  day.isToday ? 'bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
                }`}
              >
                {format(day.date, 'd')}
              </span>
              
              {isManager && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddTask(day);
                  }}
                  className="text-gray-400 hover:text-primary p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
            
            <div className="mt-1 space-y-1">
              {day.tasks.slice(0, 3).map(task => (
                <div
                  key={task._id}
                  onClick={(e) => handleTaskClick(task, e)}
                  className={`px-2 py-1 text-xs rounded truncate ${
                    task.priority === 'high'
                      ? 'bg-priority-high/10 text-priority-high border-l-2 border-priority-high'
                      : task.priority === 'medium'
                      ? 'bg-priority-medium/10 text-priority-medium border-l-2 border-priority-medium'
                      : 'bg-priority-low/10 text-priority-low border-l-2 border-priority-low'
                  }`}
                >
                  {task.taskName}
                </div>
              ))}
              
              {day.tasks.length > 3 && (
                <div className="text-xs text-gray-500 pl-2">
                  +{day.tasks.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isTaskModalOpen && selectedDay && (
        <TaskModal
          day={selectedDay}
          onClose={() => setIsTaskModalOpen(false)}
          onAddTask={() => {
            setIsTaskModalOpen(false);
            setIsTaskFormOpen(true);
          }}
          onTaskClick={handleTaskClick}
        />
      )}

      {isTaskFormOpen && selectedDay && (
        <TaskForm
          selectedDate={selectedDay.date}
          task={selectedTask}
          onClose={() => setIsTaskFormOpen(false)}
          onSave={() => {
            setIsTaskFormOpen(false);
            refreshTasks();
          }}
        />
      )}
    </div>
  );
};

export default Calendar;