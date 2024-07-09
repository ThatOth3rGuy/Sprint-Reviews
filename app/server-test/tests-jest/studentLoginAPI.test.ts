// tests-jest/studentLogin.test.ts
import handler from '../../src/pages/api/auth/studentLogin';
import { authenticateStudent } from '../../src/db';
import { login } from '../../src/lib';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

declare global {
  var pool: mysql.Pool;
}

jest.mock('../../src/db', () => ({
  authenticateStudent: jest.fn(),
}));

jest.mock('../../src/lib', () => ({
  login: jest.fn(),
}));

describe('API endpoint handler tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should authenticate a student successfully', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        email: 'john.doe@example.com',
        password: 'password123',
      },
    });

    (authenticateStudent as jest.Mock).mockResolvedValueOnce(true);
    (login as jest.Mock).mockResolvedValueOnce(undefined);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Authenticated' });
    expect(authenticateStudent).toHaveBeenCalledWith('john.doe@example.com', 'password123');
    expect(login).toHaveBeenCalledWith({ email: 'john.doe@example.com', password: 'password123', role: 'student' }, res);
  });


  test('should return 401 for invalid credentials', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        email: 'unknown@example.com',
        password: 'invalidpassword',
      },
    });

    (authenticateStudent as jest.Mock).mockResolvedValueOnce(false);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ message: 'Invalid email or password' });
    expect(authenticateStudent).toHaveBeenCalledWith('unknown@example.com', 'invalidpassword');
  });

  test('should return 500 for internal server error', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        email: 'error@example.com',
        password: 'password123',
      },
    });

    (authenticateStudent as jest.Mock).mockRejectedValueOnce(new Error('Internal server error'));

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
