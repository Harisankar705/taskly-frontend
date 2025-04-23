import axios from 'axios';
import { ITask } from '../interfaces/interfaces';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use((config)=>{
  const token=localStorage.getItem('token')
  console.log("TOKEN",token)
  if(token)
  {
    config.headers.Authorization=`Bearer ${token}`
  }
  return config
},(error)=>{
  return Promise.reject(error)
})

export const taskApi = {
  getTasks: async (date?: string) => {
    const params = date ? { date } : {};
    const response = await api.get('/tasks', { params });
    return response.data;
  },
  
  createTask: async (taskData: ITask) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  updateTask: async (id: string, taskData: ITask) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  updateStatus: async (id: string|undefined, status:string) => {
    const response = await api.put(`/updatestatus/${id}`, status);
    return response.data;
  },
  
  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export const userApi = {
  getManagers: async () => {
    const response = await api.get('/tasks/managers');
    console.log("managers",response)
    return response.data;
  },
  
  getEmployees: async (managerId?: string) => {
    const params = managerId ? { managerId } : {};
    const response = await api.get('/tasks/employees', { params });
    console.log(response)
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};