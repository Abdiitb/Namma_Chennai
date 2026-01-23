import { Platform } from 'react-native';

// API base URL - uses localhost for web, machine IP for native devices
export const API_BASE_URL = Platform.OS === 'web' 
  ? window.location.protocol + '//' + window.location.hostname + ':3000' 
  : 'http://namma-chennai.app.seekshiva.in:3000';

export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CLASSIFY: '/api/ai/classify-image',
} as const;
