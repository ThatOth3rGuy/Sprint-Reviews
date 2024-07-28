// tests-jest/createAssignment.test.ts
import handler from '../../src/pages/api/addNew/createAssignment';
import { addAssignmentToCourse } from '../../src/db';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../src/db', () => ({
  addAssignmentToCourse: jest.fn(),
}));

describe('API endpoint handler tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create an assignment successfully', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        title: 'Test Assignment',
        description: 'Test Description',
        dueDate: '2024-07-15',
        file: 'testfile.pdf',
        groupAssignment: true,
        courseID: 1,
        allowedFileTypes: ['pdf', 'docx']
      },
    });

    const mockResult = { id: 1, title: 'Test Assignment' };
    (addAssignmentToCourse as jest.Mock).mockResolvedValueOnce(mockResult);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Assignment created successfully', result: mockResult });
    expect(addAssignmentToCourse).toHaveBeenCalledWith('Test Assignment', 'Test Description', '2024-07-15', 'testfile.pdf', true, 1, ['pdf', 'docx']);
  });

  test('should return 400 if required fields are missing', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        title: 'Test Assignment',
        description: 'Test Description',
        dueDate: '2024-07-15',
        file: 'testfile.pdf',
        groupAssignment: true,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Missing required fields' });
  });

  test('should return 500 if there is an error creating the assignment', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        title: 'Test Assignment',
        description: 'Test Description',
        dueDate: '2024-07-15',
        file: 'testfile.pdf',
        groupAssignment: true,
        courseID: 1,
        allowedFileTypes: ['pdf', 'docx']
      },
    });

    const mockError = new Error('Database error');
    (addAssignmentToCourse as jest.Mock).mockRejectedValueOnce(mockError);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: 'An error occurred while creating the assignment',
      error: mockError.message,
      stack: expect.any(String)
    });
  });

  test('should return 405 for unsupported methods', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ message: 'Method not allowed' });
  });
});
