import React, { ReactNode, useState, useEffect } from 'react';
import { Zero } from '@rocicorp/zero';
import { expoSQLiteStoreProvider } from '@rocicorp/zero/expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { schema } from './schema';

type ZeroInstance = Zero<typeof schema>;

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface ZeroContextType {
  zero: ZeroInstance | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
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

const API_BASE_URL = 'http://namma-chennai.app.seekshiva.in:3000'; // Updated for mobile device testing
const ZERO_SERVER_URL = 'http://namma-chennai.app.seekshiva.in:4848'; // Updated for mobile device testing

console.log('API_BASE_URL set to:', API_BASE_URL);
console.log('ZERO_SERVER_URL set to:', ZERO_SERVER_URL);

export function ZeroProvider({ children }: ZeroProviderProps) {
  const [zero, setZero] = useState<ZeroInstance | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initializeZero();
  }, []);

  async function initializeZero() {
    try {
      console.log('Initializing Zero with server:', ZERO_SERVER_URL);
      
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      let currentUser: User | null = null;
      if (token && userData) {
        setIsAuthenticated(true);
        currentUser = JSON.parse(userData);
        setUser(currentUser);
      }

      console.log('Creating Zero instance with:', {
        server: ZERO_SERVER_URL,
        hasSchema: !!schema,
        userID: currentUser?.id || 'anonymous',
        schemaKeys: Object.keys(schema.tables)
      });

      const zeroInstance = new Zero({
        server: ZERO_SERVER_URL,
        schema,
        kvStore: expoSQLiteStoreProvider(),
        userID: currentUser?.id || 'anonymous-user',
      });

      console.log('Zero instance created successfully');
      console.log('Zero instance properties:', {
        userID: zeroInstance.userID,
        availableProperties: Object.getOwnPropertyNames(zeroInstance)
      });
      
      // Add some delay for connection establishment
      console.log('Waiting for Zero initialization...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setZero(zeroInstance);
    } catch (error) {
      console.error('Failed to initialize Zero:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
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