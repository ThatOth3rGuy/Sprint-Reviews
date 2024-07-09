// tests-jest/logoutAPI.test.ts
import handler from '../../src/pages/api/auth/logout';
import { logout } from '../../src/lib';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../src/lib', () => ({
  logout: jest.fn(),
}));

describe('Logout API endpoint handler tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should log out successfully', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    });

    (logout as jest.Mock).mockResolvedValueOnce(undefined);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Logged out' });
    expect(logout).toHaveBeenCalledWith(res);
  });

  test('should return 500 for internal server error', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    });

    (logout as jest.Mock).mockRejectedValueOnce(new Error('Internal server error'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
  });

  test('should return 405 for unsupported methods', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getHeaders().allow).toEqual(['POST']);
  });
});
