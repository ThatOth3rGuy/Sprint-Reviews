// __tests__/api/auth/instructorLogin.test.ts

import handler from '../../src/pages/api/auth/instructorLogin';
import { authenticateInstructor, authenticateAdmin } from '../../src/db';
import { login } from '../../src/lib';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../src/db', () => ({
  authenticateInstructor: jest.fn(),
  authenticateAdmin: jest.fn(),
}));

jest.mock('../../src/lib', () => ({
  login: jest.fn(),
}));

describe('/api/auth/instructorLogin API endpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should authenticate an instructor successfully', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        email: 'instructor@example.com',
        password: 'password123',
      },
    });

    (authenticateInstructor as jest.Mock).mockResolvedValueOnce(true);
    (authenticateAdmin as jest.Mock).mockResolvedValueOnce(false);
    (login as jest.Mock).mockResolvedValueOnce(undefined);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Authenticated' });
    expect(authenticateInstructor).toHaveBeenCalledWith('instructor@example.com', 'password123');
    expect(authenticateAdmin).toHaveBeenCalledWith('instructor@example.com', 'password123');
    expect(login).toHaveBeenCalledWith({ email: 'instructor@example.com', password: 'password123', role: 'instructor' }, res);
  });

  test('should authenticate an admin successfully', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        email: 'admin@example.com',
        password: 'password123',
      },
    });

    (authenticateInstructor as jest.Mock).mockResolvedValueOnce(true);
    (authenticateAdmin as jest.Mock).mockResolvedValueOnce(true);
    (login as jest.Mock).mockResolvedValueOnce(undefined);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Authenticated' });
    expect(authenticateInstructor).toHaveBeenCalledWith('admin@example.com', 'password123');
    expect(authenticateAdmin).toHaveBeenCalledWith('admin@example.com', 'password123');
    expect(login).toHaveBeenCalledWith({ email: 'admin@example.com', password: 'password123', role: 'admin' }, res);
  });

  test('should return 401 for invalid credentials', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        email: 'unknown@example.com',
        password: 'invalidpassword',
      },
    });

    (authenticateInstructor as jest.Mock).mockResolvedValueOnce(false);
    (authenticateAdmin as jest.Mock).mockResolvedValueOnce(false);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ message: 'Invalid email or password' });
    expect(authenticateInstructor).toHaveBeenCalledWith('unknown@example.com', 'invalidpassword');
    expect(authenticateAdmin).toHaveBeenCalledWith('unknown@example.com', 'invalidpassword');
  });

  test('should return 500 for internal server error', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        email: 'error@example.com',
        password: 'password123',
      },
    });

    (authenticateInstructor as jest.Mock).mockRejectedValueOnce(new Error('Internal server error'));

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
