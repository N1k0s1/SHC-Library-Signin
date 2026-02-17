/**
 * API Service for SHC Library Signin App
 * Handles all API communications with the backend
 */

import { API_ENDPOINTS, API_TIMEOUT, ApiResponse, DEFAULT_HEADERS } from '../constants/Api';

class ApiService {
  /**
   * Make a generic API request
   */
  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...DEFAULT_HEADERS,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your connection and try again.');
        }
        throw error;
      }
      
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Student sign-in/out toggle
   */
  async toggleStudentSignInOut(studentId: string, reason?: string, classCode?: string): Promise<ApiResponse> {
    return this.makeRequest(API_ENDPOINTS.STUDENT_SIGNIN_OUT, {
      method: 'POST',
      body: JSON.stringify({ studentId, reason, classCode }),
    });
  }

  /**
   * Explicit student sign-in
   */
  async signInStudent(studentId: string): Promise<ApiResponse> {
    return this.makeRequest(API_ENDPOINTS.STUDENT_SIGNIN, {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    });
  }

  /**
   * Explicit student sign-out
   */
  async signOutStudent(studentId: string): Promise<ApiResponse> {
    return this.makeRequest(API_ENDPOINTS.STUDENT_SIGNOUT, {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    });
  }

  /**
   * Get student status
   */
  async getStudentStatus(studentId: string): Promise<ApiResponse<{ studentId: string; isInLibrary: boolean }>> {
    return this.makeRequest(API_ENDPOINTS.STUDENT_STATUS(studentId), {
      method: 'GET',
    });
  }

  /**
   * Health check
   */
  async checkHealth(): Promise<ApiResponse> {
    return this.makeRequest(API_ENDPOINTS.HEALTH, {
      method: 'GET',
    });
  }

  /**
   * Test connection to backend
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.checkHealth();
      // Check for either success: true OR status: 'ok' (which the backend currently sends)
      return response.success || (response as any).status === 'ok';
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;