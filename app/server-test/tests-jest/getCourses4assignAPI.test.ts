// // tests-jest/getCourses4Assign.test.ts
// import handler from '../../src/pages/api/courses/getCourses4assign';
// import { getCourses } from '../../src/db';
// import { createMocks } from 'node-mocks-http';
// import type { NextApiRequest, NextApiResponse } from 'next';

// jest.mock('../../src/db', () => ({
//   getCourses: jest.fn(),
// }));

// describe('API endpoint handler tests', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('should return courses successfully', async () => {
//     const courses = [
//       { id: 1, name: 'Course 1' },
//       { id: 2, name: 'Course 2' },
//     ];

//     (getCourses as jest.Mock).mockResolvedValueOnce(courses);

//     const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
//       method: 'GET',
//     });

//     await handler(req, res);

//     expect(res._getStatusCode()).toBe(200);
//     expect(res._getJSONData()).toEqual(courses);
//     expect(getCourses).toHaveBeenCalled();
//   });

//   test('should return 500 if there is an error fetching courses', async () => {
//     const mockError = new Error('Database error');
//     (getCourses as jest.Mock).mockRejectedValueOnce(mockError);

//     const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
//       method: 'GET',
//     });

//     await handler(req, res);

//     expect(res._getStatusCode()).toBe(500);
//     expect(res._getJSONData()).toEqual({ message: 'An error occurred while fetching the courses.' });
//   });

//   test('should return 405 for unsupported methods', async () => {
//     const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
//       method: 'POST',
//     });

//     await handler(req, res);

//     expect(res._getStatusCode()).toBe(405);
//     expect(res._getJSONData()).toEqual({ message: 'Method not allowed.' });
//   });
// });
