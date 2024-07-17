// tests-jest/getAssignment.test.ts
import handler from '../../src/pages/api/assignments/getAssignmentForStudentView';
import { getAssignmentForStudentView } from '../../src/db';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../src/db', () => ({
  getAssignmentForStudentView: jest.fn(),
}));

describe('API endpoint handler tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return an assignment successfully', async () => {
    const assignment = { id: 1, title: 'Assignment 1', description: 'Test Description' };

    (getAssignmentForStudentView as jest.Mock).mockResolvedValueOnce(assignment);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        id: '1',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(assignment);
    expect(getAssignmentForStudentView).toHaveBeenCalledWith(1);
  });

  test('should return 400 for invalid assignment ID', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        id: ['1', '2'], // Invalid ID
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Invalid assignment ID' });
  });

  test('should return 404 if assignment not found', async () => {
    (getAssignmentForStudentView as jest.Mock).mockResolvedValueOnce(null);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        id: '1',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'Assignment not found' });
    expect(getAssignmentForStudentView).toHaveBeenCalledWith(1);
  });

  test('should return 500 if there is an error fetching the assignment', async () => {
    const mockError = new Error('Database error');
    (getAssignmentForStudentView as jest.Mock).mockRejectedValueOnce(mockError);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        id: '1',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: 'An error occurred while fetching the assignment',
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
