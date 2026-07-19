/**
 * Unit tests for the mobile app's ApiService.
 * constants/Api is mocked to avoid importing the React Native runtime, and
 * global.fetch is stubbed so no real network calls are made.
 */

jest.mock('../constants/Api', () => ({
  getApiEndpoints: () => ({
    STUDENT_SIGNIN_OUT: 'http://api/api/student/toggle',
    STUDENT_SIGNIN: 'http://api/api/checkin',
    STUDENT_SIGNOUT: 'http://api/api/checkout',
    STUDENT_STATUS: (id: string) => `http://api/api/student/status/${id}`,
    BACKGROUND_IMAGE: 'http://api/api/config/background-image',
    HEALTH: 'http://api/health',
  }),
  getDefaultHeaders: () => ({ 'Content-Type': 'application/json' }),
  API_TIMEOUT: 10000,
}));

import { apiService } from '../services/ApiService';

const mockFetch = (body: any, ok = true, status = 200) =>
  jest.fn().mockResolvedValue({
    ok,
    status,
    json: jest.fn().mockResolvedValue(body),
  });

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ApiService.toggleStudentSignInOut', () => {
  it('POSTs to the toggle endpoint with the full body and JSON header', async () => {
    global.fetch = mockFetch({ success: true, action: 'sign-in' }) as any;

    const res = await apiService.toggleStudentSignInOut('12345', 'Ann', 'study', '9A');

    expect(res).toEqual({ success: true, action: 'sign-in' });
    const [url, opts] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('http://api/api/student/toggle');
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body)).toEqual({ studentId: '12345', name: 'Ann', reason: 'study', classCode: '9A' });
    expect(opts.headers['Content-Type']).toBe('application/json');
  });

  it('omits undefined optional fields gracefully', async () => {
    global.fetch = mockFetch({ success: true }) as any;
    await apiService.toggleStudentSignInOut('12345');
    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.studentId).toBe('12345');
    expect(body.name).toBeUndefined();
  });
});

describe('ApiService.signInStudent / signOutStudent', () => {
  it('signInStudent POSTs studentId to the checkin endpoint', async () => {
    global.fetch = mockFetch({ message: 'Check-in successful' }) as any;
    await apiService.signInStudent('12345');
    const [url, opts] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('http://api/api/checkin');
    expect(JSON.parse(opts.body)).toEqual({ studentId: '12345' });
  });

  it('signOutStudent POSTs studentId to the checkout endpoint', async () => {
    global.fetch = mockFetch({ message: 'Check-out successful' }) as any;
    await apiService.signOutStudent('12345');
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe('http://api/api/checkout');
  });
});

describe('ApiService.getStudentStatus', () => {
  it('GETs the status endpoint with the id in the path', async () => {
    global.fetch = mockFetch({ success: true, data: { studentId: '12345', isInLibrary: true } }) as any;
    const res = await apiService.getStudentStatus('12345');
    const [url, opts] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('http://api/api/student/status/12345');
    expect(opts.method).toBe('GET');
    expect(res.data?.isInLibrary).toBe(true);
  });
});

describe('ApiService.getBackgroundImage', () => {
  it('GETs the background image config', async () => {
    global.fetch = mockFetch({ success: true, data: { url: 'http://cdn/x.jpg' } }) as any;
    const res = await apiService.getBackgroundImage();
    expect(res.data?.url).toBe('http://cdn/x.jpg');
  });
});

describe('ApiService error handling', () => {
  it('throws using the server-provided message on a non-ok response', async () => {
    global.fetch = mockFetch({ message: 'Student ID is required' }, false, 400) as any;
    await expect(apiService.signInStudent('')).rejects.toThrow('Student ID is required');
  });

  it('falls back to an HTTP status message when the body has no message', async () => {
    global.fetch = mockFetch({}, false, 500) as any;
    await expect(apiService.signInStudent('1')).rejects.toThrow('HTTP error! status: 500');
  });

  it('maps an AbortError to a friendly timeout message', async () => {
    const abort = Object.assign(new Error('aborted'), { name: 'AbortError' });
    global.fetch = jest.fn().mockRejectedValue(abort) as any;
    await expect(apiService.checkHealth()).rejects.toThrow('Request timed out');
  });

  it('re-throws a generic network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network down')) as any;
    await expect(apiService.checkHealth()).rejects.toThrow('Network down');
  });
});

describe('ApiService.testConnection', () => {
  it('returns true when health responds success: true', async () => {
    global.fetch = mockFetch({ success: true }) as any;
    await expect(apiService.testConnection()).resolves.toBe(true);
  });

  it('returns true when health responds status: ok (no success flag)', async () => {
    global.fetch = mockFetch({ status: 'ok' }) as any;
    await expect(apiService.testConnection()).resolves.toBe(true);
  });

  it('returns false when the health check throws', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn().mockRejectedValue(new Error('boom')) as any;
    await expect(apiService.testConnection()).resolves.toBe(false);
  });
});
