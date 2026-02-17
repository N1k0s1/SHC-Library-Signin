/**
 * Custom hook to manage API connection status
 */

import { useEffect, useState } from 'react';
import { apiService } from '../services/ApiService';

export interface ConnectionStatus {
  isConnected: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  error: string | null;
}

export const useApiConnection = (checkInterval: number = 30000) => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isChecking: true,
    lastChecked: null,
    error: null,
  });

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, isChecking: true, error: null }));
    
    try {
      const isConnected = await apiService.testConnection();
      setStatus({
        isConnected,
        isChecking: false,
        lastChecked: new Date(),
        error: null,
      });
    } catch (error) {
      setStatus({
        isConnected: false,
        isChecking: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Connection failed',
      });
    }
  };

  useEffect(() => {
    // Initial check
    checkConnection();

    // Set up periodic checks
    const interval = setInterval(checkConnection, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval]);

  return {
    ...status,
    checkConnection,
  };
};