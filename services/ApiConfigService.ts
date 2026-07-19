import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { getApiBaseUrl, setRuntimeApiConfig } from '@/constants/Api';

const API_CONFIG_STORAGE_KEY = 'libthority_api_config';

export interface StoredApiConfig {
  baseUrl: string;
  apiKey: string;
}

const saveWeb = (value: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(API_CONFIG_STORAGE_KEY, value);
  }
};

const loadWeb = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(API_CONFIG_STORAGE_KEY);
};

const removeWeb = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(API_CONFIG_STORAGE_KEY);
  }
};

export const loadApiConfig = async (): Promise<StoredApiConfig | null> => {
  const raw =
    Platform.OS === 'web'
      ? loadWeb()
      : await SecureStore.getItemAsync(API_CONFIG_STORAGE_KEY);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredApiConfig;
    if (!parsed.baseUrl || !parsed.apiKey) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const applyStoredApiConfig = async (): Promise<void> => {
  const config = await loadApiConfig();
  if (!config) return;
  setRuntimeApiConfig(config);
};

export const saveApiConfig = async (config: StoredApiConfig): Promise<void> => {
  const payload = JSON.stringify({
    baseUrl: config.baseUrl.trim(),
    apiKey: config.apiKey.trim(),
  });

  if (Platform.OS === 'web') {
    saveWeb(payload);
  } else {
    await SecureStore.setItemAsync(API_CONFIG_STORAGE_KEY, payload);
  }

  setRuntimeApiConfig(config);
};

export const clearApiConfig = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    removeWeb();
  } else {
    await SecureStore.deleteItemAsync(API_CONFIG_STORAGE_KEY);
  }

  setRuntimeApiConfig({ baseUrl: getApiBaseUrl(), apiKey: '' });
};
