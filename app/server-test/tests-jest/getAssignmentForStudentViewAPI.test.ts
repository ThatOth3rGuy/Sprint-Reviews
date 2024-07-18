// tests-jest/getAssignment.test.ts
import handler from '../../src/pages/api/assignments/getAssignmentForStudentView';
import { query } from '../../src/db';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

describe('API endpoint handler tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return assignments successfully', async () => {
    const assignments = [
      { assignmentID: 1, title: 'Assignment 1', deadline: '2024-12-31', descr: 'Description 1' },
      { assignmentID: 2, title: 'Assignment 2', deadline: '2024-12-31', descr: 'Description 2' },
    ];

    (query as jest.Mock).mockResolvedValueOnce(assignments);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        courseID: '1',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ courses: assignments });
    expect(query).toHaveBeenCalledWith(
      `
    SELECT assignmentID, title, deadline, descr
    FROM assignment
    WHERE courseID = ? 
  `,
      [1]
    );
  });

  test('should return 500 if there is an internal server error', async () => {
    const mockError = new Error('Database error');
    (query as jest.Mock).mockRejectedValueOnce(mockError);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        courseID: '1',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: 'Failed to fetch courses' });
  });

  test('should return 405 if method is not GET', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toBe('');
  });
});
