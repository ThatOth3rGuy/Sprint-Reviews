// tests-jest/deleteCourse.test.ts
import handler from '../../src/pages/api/deleteCourse';
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

  test('should delete a course successfully', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        courseID: 1,
      },
    });

    (query as jest.Mock).mockResolvedValueOnce(undefined); // Simulate successful deletion

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Course deleted successfully' });
    expect(query).toHaveBeenCalledWith('DELETE FROM course WHERE courseID = ?', [1], undefined);
  });

  test('should return 500 if there is an error deleting the course', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        courseID: 1,
      },
    });

    const mockError = new Error('Database error');
    (query as jest.Mock).mockRejectedValueOnce(mockError);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: 'Internal Server Error' });
  });

  test('should return 405 for unsupported methods', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toBe('Method GET Not Allowed');
    expect(res.getHeader('Allow')).toEqual(['POST']);
  });
});
