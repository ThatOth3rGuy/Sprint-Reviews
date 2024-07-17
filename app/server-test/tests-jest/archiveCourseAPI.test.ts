// tests-jest/archiveCourse.test.ts
import handler from '../../src/pages/api/courses/archiveCourse';
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

  test('should toggle not archived course to be archived', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { courseID: 1 },
    });

    (query as jest.Mock).mockResolvedValueOnce([{ isArchived: false }]); // Current status is not archived
    (query as jest.Mock).mockResolvedValueOnce(undefined); // Update query

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Course archived status toggled successfully' });
    expect(query).toHaveBeenCalledWith('SELECT isArchived FROM course WHERE courseID = ?', [1]);
    expect(query).toHaveBeenCalledWith('UPDATE course SET isArchived = ? WHERE courseID = ?', [true, 1]);
  });

  test('should toggle archived course to be not archived', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { courseID: 1 },
    });

    (query as jest.Mock).mockResolvedValueOnce([{ isArchived: true }]); // Current status is archived
    (query as jest.Mock).mockResolvedValueOnce(undefined); // Update query

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Course archived status toggled successfully' });
    expect(query).toHaveBeenCalledWith('SELECT isArchived FROM course WHERE courseID = ?', [1]);
    expect(query).toHaveBeenCalledWith('UPDATE course SET isArchived = ? WHERE courseID = ?', [false, 1]);
  });

  test('should return 404 if course is not found', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { courseID: 999 },
    });

    (query as jest.Mock).mockResolvedValueOnce([]); // No rows returned

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'Course not found' });
    expect(query).toHaveBeenCalledWith('SELECT isArchived FROM course WHERE courseID = ?', [999]);
  });

  test('should return 500 for internal server error', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { courseID: 1 },
    });

    (query as jest.Mock).mockRejectedValueOnce(new Error('Internal server error'));

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
    expect(res._getHeaders().allow).toEqual(['POST']);
  });
});
