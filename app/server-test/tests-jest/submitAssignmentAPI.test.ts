// tests-jest/submitAssignment.test.ts
import handler from '../../src/pages/api/submitAssignment';
import { submitAssignment } from '../../src/db';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs';

jest.mock('../../src/db', () => ({
  submitAssignment: jest.fn(),
}));

jest.mock('multer', () => {
  const multer = jest.fn(() => {
    const instance = {
      single: jest.fn((fieldName: string) => (req: any, res: any, next: any) => {
        req.file = {
          path: '/tmp/testfile',
          originalname: 'testfile.txt',
        };
        next();
      }),
      array: jest.fn(),
      fields: jest.fn(),
      none: jest.fn(),
      any: jest.fn(),
    };
    return instance;
  });
  return multer;
});

describe('API endpoint handler tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    if (fs.existsSync('/tmp/testfile')) {
      fs.unlinkSync('/tmp/testfile');
    }
  });

  test('should submit assignment successfully', async () => {
    const result = { success: true };

    (submitAssignment as jest.Mock).mockResolvedValueOnce(result);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        assignmentID: '1',
        studentID: '1',
      },
    });

    // Manually setting the file object as multer would do
    (req as any).file = {
      path: '/tmp/testfile',
      originalname: 'testfile.txt',
    };

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(result);
    expect(submitAssignment).toHaveBeenCalledWith(1, 1, {
      path: '/tmp/testfile',
      originalname: 'testfile.txt',
    });
  });

  test('should return 500 if there is an error uploading file', async () => {
    const mockMulter = multer();
    mockMulter.single = jest.fn((fieldName: string) => (req: any, res: any, next: any) => {
      next(new Error('Upload error'));
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Error uploading file' });
  });

  test('should return 500 if there is an error submitting assignment', async () => {
    const mockError = new Error('Database error');
    (submitAssignment as jest.Mock).mockRejectedValueOnce(mockError);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        assignmentID: '1',
        studentID: '1',
      },
    });

    // Manually setting the file object as multer would do
    (req as any).file = {
      path: '/tmp/testfile',
      originalname: 'testfile.txt',
    };

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Error submitting assignment' });
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
