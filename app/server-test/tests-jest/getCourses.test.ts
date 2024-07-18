// tests-jest/getCourses.test.ts
import mysql from 'mysql2/promise';
import { getCourses } from '../../src/db';

describe('getCourses Tests', () => {
  let connection: mysql.PoolConnection;
  // Since multiple tests are being run, use a baseID to ensure unique IDs
  // then only test for getting these specific courses
  const uniqueID = Math.floor(Math.random() * 1000000); // Base value for unique IDs

  beforeAll(async () => {
    connection = await global.pool.getConnection();

    // Ensure the instructor and courses exist
    await connection.query(
      `INSERT INTO user (userID, firstName, lastName, email, pwd, userRole) VALUES 
      (${uniqueID + 1}, 'Test', 'Instructor', 'test.instructor.${uniqueID}@example.com', 'password123', 'instructor')
      ON DUPLICATE KEY UPDATE email = VALUES(email)`
    );

    await connection.query(
      `INSERT INTO instructor (instructorID, userID, isAdmin, departments) VALUES 
      (${uniqueID + 1}, ${uniqueID + 1}, TRUE, 'Test Department')
      ON DUPLICATE KEY UPDATE departments = 'Test Department'`
    );

    await connection.query(
      `INSERT INTO course (courseID, courseName, isArchived, instructorID) VALUES 
      (${uniqueID + 2}, 'Test Course 1', FALSE, ${uniqueID + 1}),
      (${uniqueID + 3}, 'Test Course 2', FALSE, ${uniqueID + 1}),
      (${uniqueID + 4}, 'Test Course 3', TRUE, ${uniqueID + 1})
      ON DUPLICATE KEY UPDATE courseName = VALUES(courseName)`
    );
  });

  afterAll(async () => {
    if (connection) {
      await connection.query(`DELETE FROM course WHERE courseID IN (${uniqueID + 2}, ${uniqueID + 3}, ${uniqueID + 4})`);
      await connection.query(`DELETE FROM instructor WHERE userID = ${uniqueID + 1}`);
      await connection.query(`DELETE FROM user WHERE userID = ${uniqueID + 1}`);
      connection.release();
    }
  });

  test('should fetch all courses', async () => {
    const courses = await getCourses(global.pool);

    expect(courses.length).toBeGreaterThanOrEqual(3);
    expect(courses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          courseID: uniqueID + 2,
          courseName: 'Test Course 1',
          isArchived: 0,
          instructorID: uniqueID + 1,
        }),
        expect.objectContaining({
          courseID: uniqueID + 3,
          courseName: 'Test Course 2',
          isArchived: 0,
          instructorID: uniqueID + 1,
        }),
        expect.objectContaining({
          courseID: uniqueID + 4,
          courseName: 'Test Course 3',
          isArchived: 1,
          instructorID: uniqueID + 1,
        }),
      ])
    );
  });

  test('should handle no courses found', async () => {
    // Clean up specific courses for this test
    await connection.query(`DELETE FROM course WHERE courseID IN (${uniqueID + 2}, ${uniqueID + 3}, ${uniqueID + 4})`);

    const courses = await getCourses(global.pool);

    // Ensure only our test courses are removed and checked
    const filteredCourses = courses.filter(course =>
      [uniqueID + 2, uniqueID + 3, uniqueID + 4].includes(course.courseID)
    );

    expect(filteredCourses.length).toBe(0);

    // Reinsert courses for cleanup
    await connection.query(
      `INSERT INTO course (courseID, courseName, isArchived, instructorID) VALUES 
      (${uniqueID + 2}, 'Test Course 1', FALSE, ${uniqueID + 1}),
      (${uniqueID + 3}, 'Test Course 2', FALSE, ${uniqueID + 1}),
      (${uniqueID + 4}, 'Test Course 3', TRUE, ${uniqueID + 1})
      ON DUPLICATE KEY UPDATE courseName = VALUES(courseName)`
    );
  });

  test('should handle database query errors', async () => {
    const mockPool = {
      execute: jest.fn().mockImplementation(() => {
        throw new Error('Simulated database error');
      }),
    };

    await expect(getCourses(mockPool as unknown as mysql.Pool)).rejects.toThrow('Simulated database error');
  });
});
