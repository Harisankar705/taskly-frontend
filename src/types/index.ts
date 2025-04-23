export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Employee' | 'Manager';
  managerId?: string;
}

export interface Task {
  _id: string;
  taskName: string;
  assignedTo: string | User;
  assignedBy: string | User;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

export interface TaskFormData {
  taskName: string;
  assignedTo: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
  priority: 'low' | 'medium' | 'high';
}