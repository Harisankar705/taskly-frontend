import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Calendar, CheckSquare } from 'lucide-react';
import { userApi } from '../../api';
import { User } from '../../types';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/useAuth';

const Register: React.FC = () => {
  const { register, isAuthenticated, error, clearError } = useAuth();
  const [managers, setManagers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Employee',
    managerId: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await userApi.getManagers();
        setManagers(response);
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };

    fetchManagers();
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    clearError();
    setPasswordError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if(formData.name.trim().length===0)
      {
        toast.error("Name cannot be empty!")
        return
      }
      if(formData.email.trim().length===0)
        {
          toast.error("Name cannot be empty!")
          return
        }
   
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
   
    setIsLoading(true);
    
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.role === 'Employee' ? formData.managerId : undefined
      );
    } catch (error) {
      console.error('Registration error:', error);
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
            <p className="text-gray-600 mt-2">Create your account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter your full name"
              />
            </div>

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

            <div className="mb-4">
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
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Create a password"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Confirm your password"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
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

            {formData.role === 'Employee' && (
              <div className="mb-6">
                <label htmlFor="managerId" className="block text-sm font-medium text-gray-700 mb-1">
                  Manager
                </label>
                <select
                  id="managerId"
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select a manager</option>
                  {managers.map(manager => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-70"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
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
              Join Taskly Today
            </h2>
            <p className="text-cream-light text-lg mb-8">
              Streamline your workflow and collaborate effectively with your team.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-cream-light/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cream">1</span>
              </div>
              <div>
                <h3 className="font-medium text-cream-light">Role-Based Access</h3>
                <p className="text-cream/80">Different permissions for Managers and Employees.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-cream-light/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cream">2</span>
              </div>
              <div>
                <h3 className="font-medium text-cream-light">Intuitive Interface</h3>
                <p className="text-cream/80">Easy-to-use calendar interface for all your tasks.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-cream-light/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cream">3</span>
              </div>
              <div>
                <h3 className="font-medium text-cream-light">Task Priorities</h3>
                <p className="text-cream/80">Set priorities and track task status easily.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;