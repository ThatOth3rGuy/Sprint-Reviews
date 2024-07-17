// tests-jest/enrollStudent.test.ts
import handler from '../../src/pages/api/addNew/enrollStudents';
import { enrollStudent } from '../../src/db';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../src/db', () => ({
  enrollStudent: jest.fn(),
}));

describe('API endpoint handler tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should enroll students successfully', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        studentIDs: [1, 2, 3],
        courseID: 101,
      },
    });

    (enrollStudent as jest.Mock).mockResolvedValueOnce(undefined);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toEqual({ courseID: 101, studentIDs: [1, 2, 3] });
    expect(enrollStudent).toHaveBeenCalledTimes(3);
    expect(enrollStudent).toHaveBeenCalledWith(1, 101);
    expect(enrollStudent).toHaveBeenCalledWith(2, 101);
    expect(enrollStudent).toHaveBeenCalledWith(3, 101);
  });

  test('should return 500 if there is an error enrolling a student', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        studentIDs: [1, 2, 3],
        courseID: 101,
      },
    });

    const mockError = new Error('Database error');
    (enrollStudent as jest.Mock).mockRejectedValueOnce(mockError);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: 'Failed to enroll students in course 101', details: 'Database error' });
  });

  test('should return 405 for unsupported methods', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toBe('');
  });
});
