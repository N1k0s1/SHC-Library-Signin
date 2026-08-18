/**
 * Unit tests for pairing-code redemption. constants/Api is mocked to avoid
 * importing the React Native runtime, and global.fetch is stubbed.
 */

jest.mock('../constants/Api', () => ({
  getApiEndpoints: () => ({
    DEVICE_PAIR: 'http://api/api/device/pair',
  }),
  getApiBaseUrl: () => 'http://api',
  API_TIMEOUT: 10000,
}));

import { redeemPairingCode } from '../services/PairingService';

const mockFetch = (body: any, ok = true, status = 200) =>
  jest.fn().mockResolvedValue({
    ok,
    status,
    json: jest.fn().mockResolvedValue(body),
  });

afterEach(() => {
  jest.restoreAllMocks();
});

describe('redeemPairingCode', () => {
  it('POSTs the code and returns the issued config', async () => {
    global.fetch = mockFetch({
      success: true,
      apiKey: 'shc_abc',
      baseUrl: 'https://libthority.vercel.app',
      deviceName: 'Library iPad 1',
    }) as any;

    const result = await redeemPairingCode('123456');

    expect(result).toEqual({
      apiKey: 'shc_abc',
      baseUrl: 'https://libthority.vercel.app',
      deviceName: 'Library iPad 1',
    });

    const [url, opts] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('http://api/api/device/pair');
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body)).toEqual({ code: '123456' });
    expect(opts.headers['Content-Type']).toBe('application/json');
  });

  it('strips spaces from a typed code', async () => {
    global.fetch = mockFetch({ success: true, apiKey: 'k', baseUrl: 'http://api', deviceName: 'd' }) as any;
    await redeemPairingCode(' 12 34 56 ');
    const [, opts] = (global.fetch as jest.Mock).mock.calls[0];
    expect(JSON.parse(opts.body)).toEqual({ code: '123456' });
  });

  it('rejects a non-6-digit code before hitting the network', async () => {
    global.fetch = jest.fn() as any;
    await expect(redeemPairingCode('12ab5')).rejects.toThrow('Enter the 6-digit pairing code.');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('surfaces the server error message on a rejected code', async () => {
    global.fetch = mockFetch({ error: 'Invalid or expired pairing code' }, false, 401) as any;
    await expect(redeemPairingCode('000000')).rejects.toThrow('Invalid or expired pairing code');
  });

  it('falls back to a generic message when the server sends no error text', async () => {
    global.fetch = mockFetch({}, false, 500) as any;
    await expect(redeemPairingCode('123456')).rejects.toThrow('Pairing failed (500)');
  });

  it('falls back to the configured base URL when the server omits one', async () => {
    global.fetch = mockFetch({ success: true, apiKey: 'k', deviceName: 'd' }) as any;
    const result = await redeemPairingCode('123456');
    expect(result.baseUrl).toBe('http://api');
  });

  it('uses an override base URL when one is supplied', async () => {
    global.fetch = mockFetch({ success: true, apiKey: 'k', baseUrl: 'http://other', deviceName: 'd' }) as any;
    await redeemPairingCode('123456', 'http://other');
    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('http://other/api/device/pair');
  });
});
