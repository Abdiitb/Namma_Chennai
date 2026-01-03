import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, ENDPOINTS } from '@/constants/api';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role?: 'citizen' | 'staff' | 'supervisor' | 'admin';
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export function useLogin() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data: AuthResponse = await response.json();

      // Store auth data
      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(data.user));

      setState({
        user: data.user,
        token: data.token,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    clearError,
  };
}

export function useRegister() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          role: data.role || 'citizen',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const responseData: AuthResponse = await response.json();

      // Store auth data
      await AsyncStorage.setItem('auth_token', responseData.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(responseData.user));

      setState({
        user: responseData.user,
        token: responseData.token,
        loading: false,
        error: null,
      });

      return responseData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    register,
    clearError,
  };
}

export function useAuthState() {
  const [state, setState] = useState<{
    user: User | null;
    token: string | null;
    loading: boolean;
    initialized: boolean;
  }>({
    user: null,
    token: null,
    loading: true,
    initialized: false,
  });

  const checkAuth = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');

      if (token && userData) {
        setState({
          token,
          user: JSON.parse(userData),
          loading: false,
          initialized: true,
        });
        return true;
      }

      setState({
        token: null,
        user: null,
        loading: false,
        initialized: true,
      });
      return false;
    } catch (error) {
      setState({
        token: null,
        user: null,
        loading: false,
        initialized: true,
      });
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
    setState({
      token: null,
      user: null,
      loading: false,
      initialized: true,
    });
  }, []);

  return {
    ...state,
    checkAuth,
    logout,
  };
}
