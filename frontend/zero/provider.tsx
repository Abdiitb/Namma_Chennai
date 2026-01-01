import React, { ReactNode, useState, useEffect } from 'react';
import { Zero, createZero } from '@rocicorp/zero';
import { expoSQLiteStoreProvider } from '@rocicorp/zero/expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { schema } from './schema';

interface ZeroContextType {
  zero: Zero | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: any;
}

const ZeroContext = React.createContext<ZeroContextType>({
  zero: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  user: null,
});

interface ZeroProviderProps {
  children: ReactNode;
}

const API_BASE_URL = 'http://localhost:3000'; // Change to your LAN IP for device testing
const ZERO_SERVER_URL = 'http://localhost:4848'; // Change to your LAN IP for device testing

export function ZeroProvider({ children }: ZeroProviderProps) {
  const [zero, setZero] = useState<Zero | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    initializeZero();
  }, []);

  async function initializeZero() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }

      const zeroInstance = createZero({
        server: ZERO_SERVER_URL,
        schema,
        kvStore: expoSQLiteStoreProvider(),
        auth: async () => {
          const authToken = await AsyncStorage.getItem('auth_token');
          return authToken || '';
        },
        userID: user?.id || '',
      });

      setZero(zeroInstance);
    } catch (error) {
      console.error('Failed to initialize Zero:', error);
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { token, user: userData } = await response.json();
      
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUser(userData);
      
      // Reinitialize Zero with new auth
      await initializeZero();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      setIsAuthenticated(false);
      setUser(null);
      setZero(null);
      
      // Reinitialize Zero without auth
      await initializeZero();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <ZeroContext.Provider value={{
      zero,
      isAuthenticated,
      login,
      logout,
      user,
    }}>
      {children}
    </ZeroContext.Provider>
  );
}

export function useZero() {
  const context = React.useContext(ZeroContext);
  if (!context) {
    throw new Error('useZero must be used within ZeroProvider');
  }
  return context;
}

export default ZeroProvider;