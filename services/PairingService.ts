import { API_TIMEOUT, getApiBaseUrl, getApiEndpoints } from '../constants/Api';

export interface PairingResult {
  baseUrl: string;
  apiKey: string;
  deviceName: string;
}

const normalizeBaseUrl = (url: string) => url.trim().replace(/\/+$/, '');

/**
 * Redeems a 6-digit pairing code for this device's own API key. Runs before the
 * device has any credentials, so it sends no x-api-key header — the backend
 * exempts this one path and rate-limits it instead.
 */
export const redeemPairingCode = async (
  code: string,
  baseUrlOverride?: string
): Promise<PairingResult> => {
  const cleanedCode = code.replace(/\s/g, '');

  if (!/^\d{6}$/.test(cleanedCode)) {
    throw new Error('Enter the 6-digit pairing code.');
  }

  const targetBaseUrl = baseUrlOverride ? normalizeBaseUrl(baseUrlOverride) : null;
  const url = targetBaseUrl
    ? `${targetBaseUrl}/api/device/pair`
    : getApiEndpoints().DEVICE_PAIR;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: cleanedCode }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Pairing failed (${response.status})`);
    }

    return {
      apiKey: data.apiKey,
      baseUrl: data.baseUrl ? normalizeBaseUrl(data.baseUrl) : targetBaseUrl || getApiBaseUrl(),
      deviceName: data.deviceName,
    };
  } finally {
    clearTimeout(timeout);
  }
};
