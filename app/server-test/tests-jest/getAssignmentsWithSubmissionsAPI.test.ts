// tests-jest/getAssignmentsWithSubmissions.test.ts
import handler from '../../src/pages/api/assignments/getAssignmentWithSubmissions';
import { getAssignmentsWithSubmissions } from '../../src/db';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../src/db', () => ({
  getAssignmentsWithSubmissions: jest.fn(),
}));

describe('API endpoint handler tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return assignments with submissions successfully', async () => {
    const assignments = [
      { id: 1, title: 'Assignment 1', submissions: [] },
      { id: 2, title: 'Assignment 2', submissions: [{ id: 1, studentId: 1, submission: 'file1.pdf' }] },
    ];

    (getAssignmentsWithSubmissions as jest.Mock).mockResolvedValueOnce(assignments);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(assignments);
    expect(getAssignmentsWithSubmissions).toHaveBeenCalled();
  });

  test('should return 500 if there is an error fetching assignments with submissions', async () => {
    const mockError = new Error('Database error');
    (getAssignmentsWithSubmissions as jest.Mock).mockRejectedValueOnce(mockError);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: 'An error occurred while fetching assignments with submissions',
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
