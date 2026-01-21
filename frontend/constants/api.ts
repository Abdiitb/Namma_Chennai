import { Platform } from 'react-native';

// API base URL - uses localhost for web, machine IP for native devices
export const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000' 
  : 'http://10.5.36.24:3000';

export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CLASSIFY: '/api/ai/classify-image',
} as const;
