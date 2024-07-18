// tests-jest/getCourses.test.ts
import handler from '../../src/pages/api/courses/getAllCourses';
import { getCourses } from '../../src/db';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../src/db', () => ({
  getCourses: jest.fn(),
}));

describe('API endpoint handler tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return all courses successfully', async () => {
    const courses = [
      { id: 1, name: 'Course 1', isArchived: false },
      { id: 2, name: 'Course 2', isArchived: false },
    ];

    (getCourses as jest.Mock).mockResolvedValueOnce(courses);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        isArchived: 'false',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(courses);
    expect(getCourses).toHaveBeenCalledTimes(1);
  });

  test('should return archived courses successfully', async () => {
    const courses = [
      { id: 3, name: 'Course 3', isArchived: true },
      { id: 4, name: 'Course 4', isArchived: true },
    ];

    (getCourses as jest.Mock).mockResolvedValueOnce(courses);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        isArchived: 'true',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(courses);
    expect(getCourses).toHaveBeenCalledTimes(1);
  });

  test('should return 500 if there is an internal server error', async () => {
    const mockError = new Error('Database error');
    (getCourses as jest.Mock).mockRejectedValueOnce(mockError);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'An error occurred while fetching the courses.' });
  });

  test('should return 405 if method is not GET', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ message: 'Method not allowed.' });
  });
});
