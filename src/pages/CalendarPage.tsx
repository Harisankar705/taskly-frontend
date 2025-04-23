import React from 'react';
import Calendar from '../components/calendar/Calendar';

const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Task Calendar</h1>
      <Calendar />
    </div>
  );
};

export default CalendarPage;