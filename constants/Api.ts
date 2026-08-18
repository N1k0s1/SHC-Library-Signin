/**
 * API Configuration for SHC Library Signin App
 */

const DEFAULT_API_BASE_URL = 'https://libthority.vercel.app';
const DEFAULT_API_KEY = process.env.EXPO_PUBLIC_API_KEY ?? '';

let runtimeApiBaseUrl: string | null = null;
let runtimeApiKey: string | null = null;

const normalizeBaseUrl = (url: string) => url.trim().replace(/\/+$/, '');

export const setRuntimeApiConfig = (config: { baseUrl?: string; apiKey?: string }) => {
  const nextBaseUrl = config.baseUrl?.trim();
  runtimeApiBaseUrl = nextBaseUrl ? normalizeBaseUrl(nextBaseUrl) : null;

  const nextApiKey = config.apiKey?.trim();
  runtimeApiKey = nextApiKey ? nextApiKey : null;
};

export const getApiBaseUrl = (): string => runtimeApiBaseUrl ?? DEFAULT_API_BASE_URL;
export const getApiKey = (): string => runtimeApiKey ?? DEFAULT_API_KEY;

export const getApiEndpoints = () => {
  const apiBaseUrl = getApiBaseUrl();
  return {
    STUDENT_SIGNIN_OUT: `${apiBaseUrl}/api/student/toggle`,
    STUDENT_SIGNIN: `${apiBaseUrl}/api/checkin`,
    STUDENT_SIGNOUT: `${apiBaseUrl}/api/checkout`,
    STUDENT_STATUS: (studentId: string) => `${apiBaseUrl}/api/student/status/${studentId}`,
    BACKGROUND_IMAGE: `${apiBaseUrl}/api/config/background-image`,
    HEALTH: `${apiBaseUrl}/health`,
    DEVICE_PAIR: `${apiBaseUrl}/api/device/pair`,
    ADMIN_LOGIN: `${apiBaseUrl}/api/login`,
    ADMIN_DASHBOARD: `${apiBaseUrl}/api/admin/dashboard`,
    ADMIN_STATS: `${apiBaseUrl}/api/admin/stats`,
  };
};

// Backward-compatible exports for places that still import constants directly.
export const API_BASE_URL = getApiBaseUrl();
export const API_ENDPOINTS = getApiEndpoints();

// Request timeout configuration
export const API_TIMEOUT = 10000; // 10 seconds

export const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
  'x-api-key': getApiKey(),
});

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  action?: 'sign-in' | 'sign-out';
}
