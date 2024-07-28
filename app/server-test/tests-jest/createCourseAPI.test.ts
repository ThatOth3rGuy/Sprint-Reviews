// tests-jest/createCourse.test.ts
import handler from '../../src/pages/api/addNew/createCourse';
import { createCourse } from '../../src/db';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../src/db', () => ({
  createCourse: jest.fn(),
}));

describe('API endpoint handler tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules(); // Reset modules to ensure no state is carried over
  });

  test('should create a course successfully', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        courseName: 'New Course',
        instructorID: 1,
      },
    });

    const mockCourseId = 123;
    (createCourse as jest.Mock).mockResolvedValueOnce(mockCourseId);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toEqual({ courseId: mockCourseId });
    expect(createCourse).toHaveBeenCalledWith('New Course', 1);
  });

  test('should return 500 if there is an error creating the course', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        courseName: 'New Course',
        instructorID: 1,
      },
    });

    const mockError = new Error('Database error');
    (createCourse as jest.Mock).mockRejectedValueOnce(mockError);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: 'Failed to create course' });
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
