import React, { createContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../types';
import { api } from '../api';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../interfaces/interfaces';

type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (email: string, password: string,role:string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string, managerId?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('user',JSON.stringify(action.payload.user))
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser=localStorage.getItem('user')
      if (token && storedUser) {
        try {
          const user=JSON.parse(storedUser)
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          
          
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user, token },
            });
          
        } catch (error) {
          console.log(error)
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  const login = async (email: string, password: string,role:string) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      const response = await api.post('/login', { email, password,role});
      console.log('login response',response)
      const { user, token } = response.data;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
    } catch (error) {
      const axiosError=error as AxiosError<ApiErrorResponse>
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: axiosError.response?.data?.message || 'Login failed',
      });
    }
  };
  

  const register = async (name: string, email: string, password: string, role: string, managerId?: string) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      const userData = { name, email, password, role, managerId };
      console.log('userdata',userData)
      const response = await api.post('/signup', userData);
      const { user, token } = response.data;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
    } catch (error) {
      const axiosError=error as AxiosError<ApiErrorResponse>

      dispatch({
        type: 'LOGIN_FAILURE',
        payload: axiosError.response?.data?.message || 'Registration failed',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext}