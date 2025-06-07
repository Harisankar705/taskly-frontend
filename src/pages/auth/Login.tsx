import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Calendar, CheckSquare } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

const Login: React.FC = () => {
  const { login, isAuthenticated, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role:'Employee'
  });
  const [isLoading, setIsLoading] = useState(false);
  
 
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  clearError();
  
  if (e.target.name === 'email' && e.target.value && e.target.value.startsWith(' ')) {
    e.target.value = e.target.value.trimStart();
  }
  
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password,formData.role);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-primary text-white p-3 rounded-xl mb-4">
              <Calendar size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Taskly</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter your password"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              
            </div>
           
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-primary to-secondary p-12 text-white">
        <div className="h-full flex flex-col justify-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center bg-white/20 p-3 rounded-xl mb-4">
              <CheckSquare size={36} className="text-cream" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Organize Your Tasks with Ease
            </h2>
            <p className="text-cream-light text-lg mb-8">
              Efficiently manage your team's tasks with our intuitive calendar-based task management system.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-cream-light/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cream">1</span>
              </div>
              <div>
                <h3 className="font-medium text-cream-light">Create Tasks</h3>
                <p className="text-cream/80">Easily create and assign tasks to your team members.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-cream-light/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cream">2</span>
              </div>
              <div>
                <h3 className="font-medium text-cream-light">Track Progress</h3>
                <p className="text-cream/80">Monitor the progress of tasks in real-time.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-cream-light/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cream">3</span>
              </div>
              <div>
                <h3 className="font-medium text-cream-light">Manage Calendar</h3>
                <p className="text-cream/80">View all tasks in an intuitive calendar interface.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;