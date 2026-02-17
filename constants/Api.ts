/**
 * API Configuration for SHC Library Signin App
 * This file contains all API endpoints and configuration
 */

import { Platform } from 'react-native';

// API Base URL Configuration
const getApiBaseUrl = (): string => {
  // If you want to test against the local server in development, uncomment the following lines:
  /*
  if (__DEV__) {
    // Development environment
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to access localhost
      return 'http://10.0.2.2:3000';
    } else {
      // iOS simulator and web can use localhost
      return 'http://localhost:3000';
    }
  }
  */
  
  // Use the deployed Railway backend for both Development and Production
  return 'https://shc-library-backend-f661ae1b6b59.herokuapp.com';
};

export const API_BASE_URL = getApiBaseUrl();

// Backend URL for SHC sign-in/out toggle
const SHC_SIGNIN_OUT_URL = `${API_BASE_URL}/api/student/toggle`;

// API Endpoints
export const API_ENDPOINTS = {
  // Use Backend for toggle
  STUDENT_SIGNIN_OUT: SHC_SIGNIN_OUT_URL,

  // Keep others pointing to your Node server
  STUDENT_SIGNIN: `${API_BASE_URL}/api/checkin`,
  STUDENT_SIGNOUT: `${API_BASE_URL}/api/checkout`,
  STUDENT_STATUS: (studentId: string) =>
    `${API_BASE_URL}/api/student/status/${studentId}`,

  HEALTH: `${API_BASE_URL}/health`, // Note: You might need to add a health endpoint to server.js if it doesn't exist
  ADMIN_LOGIN: `${API_BASE_URL}/api/login`, // Changed from /api/auth/login to match server.js routes
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`, // This might not exist in server.js, check routes
  ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`, // This might not exist in server.js, check routes
};

// Request timeout configuration
export const API_TIMEOUT = 10000; // 10 seconds

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  action?: 'sign-in' | 'sign-out';
}