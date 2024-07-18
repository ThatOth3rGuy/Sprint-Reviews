// tests-jest/enrollStudents.test.ts
import handler from '../../src/pages/api/addNew/enrollStudents';
import { enrollStudent, getCourse } from '../../src/db';
import { createMocks } from 'node-mocks-http';
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../src/db', () => ({
  enrollStudent: jest.fn(),
  getCourse: jest.fn(),
}));

jest.mock('fs');
jest.mock('path');

describe('API endpoint handler tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should enroll students successfully and handle missing students', async () => {
    (enrollStudent as jest.Mock).mockResolvedValueOnce(undefined);
    (enrollStudent as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
    (enrollStudent as jest.Mock).mockResolvedValueOnce(undefined);
    (getCourse as jest.Mock).mockResolvedValueOnce({ courseName: 'TestCourse' });
    const writeFileSyncMock = fs.writeFileSync as jest.Mock;

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        studentIDs: [1, 2, 3],
        courseID: 101,
        missingData: [4],
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toEqual({
      "courseID": 101,
      "missingStudentsFilePath": "/public/TestCourse_missingStudents.csv",
      "studentIDs": [
        1,
        2,
        3,
      ],
    });
    expect(enrollStudent).toHaveBeenCalledTimes(3);
    expect(enrollStudent).toHaveBeenCalledWith('1', '101');
    expect(enrollStudent).toHaveBeenCalledWith('2', '101');
    expect(enrollStudent).toHaveBeenCalledWith('3', '101');
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      path.join(process.cwd(), 'public', 'TestCourse_missingStudents.csv'),
      'studentID\n4\n2'
    );
  });

  test('should return 500 if there is a critical error enrolling all students', async () => {
    const mockError = new Error('studentIDs is not iterable');
    (enrollStudent as jest.Mock).mockRejectedValue(mockError);
  
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        studentIDs: null,
        courseID: 101,
      },
    });
  
    await handler(req, res);
  
    // Since all individual enrollments will fail, we simulate a critical failure scenario.
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: 'Failed to enroll students in course 101',
      details: mockError.message,
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
