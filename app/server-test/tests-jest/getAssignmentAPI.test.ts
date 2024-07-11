// tests-jest/getAssignments.test.ts
import handler from '../../src/pages/api/getAssignments';
import { getAssignments } from '../../src/db';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../src/db', () => ({
  getAssignments: jest.fn(),
}));

describe('API endpoint handler tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return all assignments successfully', async () => {
    const assignments = [
      { id: 1, title: 'Assignment 1', dueDate: '2024-07-15' },
      { id: 2, title: 'Assignment 2', dueDate: '2024-08-01' },
    ];

    (getAssignments as jest.Mock).mockResolvedValueOnce(assignments);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(assignments);
    expect(getAssignments).toHaveBeenCalled();
  });

  test('should return 500 if there is an error fetching assignments', async () => {
    const mockError = new Error('Database error');
    (getAssignments as jest.Mock).mockRejectedValueOnce(mockError);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: 'An error occurred while fetching the assignments',
      error: 'Database error',
    });
  });

  test('should return 405 for unsupported methods', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ message: 'Method not allowed' });
  });
});
