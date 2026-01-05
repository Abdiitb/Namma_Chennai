import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, ENDPOINTS } from '@/constants/api';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email?: string; phone?: string; password: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      if (storedToken && userData) {
        setToken(storedToken);
        setUser(JSON.parse(userData));
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (e) {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      const data = await response.json();
      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
      setToken(data.token);
      setUser({ ...data.user, token: data.token });
    } catch (e: any) {
      setError(e.message || 'Login failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: { name: string; email?: string; phone?: string; password: string; role?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: data.role || 'citizen' }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      const responseData = await response.json();
      await AsyncStorage.setItem('auth_token', responseData.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(responseData.user));
      setToken(responseData.token);
      setUser({ ...responseData.user, token: responseData.token });
    } catch (e: any) {
      setError(e.message || 'Registration failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, token, loading, initialized, error, login, register, logout, clearError, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
