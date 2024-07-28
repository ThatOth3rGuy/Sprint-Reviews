// tests-jest/updateCourseName.test.ts

import { createMocks, RequestMethod, MockResponse, MockRequest } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../src/pages/api/courses/updateCourseName';
import { query } from '../../src/db';

jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

interface ExtendedMockRequest extends MockRequest<NextApiRequest> {
  env: NodeJS.ProcessEnv;
}

describe('/api/updateCourseName API Endpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequestResponse = (method: RequestMethod, body?: any): { req: ExtendedMockRequest; res: MockResponse<NextApiResponse> } => {
    const { req, res } = createMocks({ method, body });
    (req as unknown as ExtendedMockRequest).env = process.env; // Extend the mock request with the env property
    return { req: req as unknown as ExtendedMockRequest, res: res as unknown as MockResponse<NextApiResponse> };
  };

  test('should update course name and return 200 status', async () => {
    const { req, res } = createMockRequestResponse('POST', {
      courseID: 1,
      newCourseName: 'New Course Name',
    });

    (query as jest.Mock).mockResolvedValueOnce({});

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Course name updated successfully' });
    expect(query).toHaveBeenCalledWith('UPDATE course SET courseName = ? WHERE courseID = ?', ['New Course Name', 1]);
  });

  test('should return 500 status on database error', async () => {
    const { req, res } = createMockRequestResponse('POST', {
      courseID: 1,
      newCourseName: 'New Course Name',
    });

    (query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: 'Internal Server Error' });
    expect(query).toHaveBeenCalledWith('UPDATE course SET courseName = ? WHERE courseID = ?', ['New Course Name', 1]);
  });

  test('should return 405 status for non-POST methods', async () => {
    const { req, res } = createMockRequestResponse('GET');

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getHeaders()).toHaveProperty('allow', ['POST']);
  });
});
