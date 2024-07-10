// tests-jest/deleteCourse.test.ts
import mysql from 'mysql2/promise';
import deleteCourseHandler from '../../src/pages/api/deleteCourse';
import { mockNextApi } from '../utils/mockNextApi'; // Adjust the import path as necessary

describe('deleteCourse API Tests', () => {
  let connection: mysql.PoolConnection;

  beforeAll(async () => {
    try {
        connection = await global.pool.getConnection();
      } catch (error) {
        console.error('Error getting database connection:', error);
        throw error;
      }

    // Ensure the user exists
    await connection.query(
      `INSERT INTO user (userID, firstName, lastName, email, pwd, userRole) VALUES (1000, 'Test', 'Instructor', 'test.instructor@example.com', 'password123', 'instructor') ON DUPLICATE KEY UPDATE email = 'test.instructor@example.com'`
    );

    // Ensure the instructor exists
    await connection.query(
      `INSERT INTO instructor (userID, isAdmin, departments) VALUES (1000, TRUE, 'Test Department') ON DUPLICATE KEY UPDATE departments = 'Test Department'`
    );

    // Ensure the course exists
    await connection.query(
      `INSERT INTO course (courseID, courseName, isArchived, instructorID) VALUES (1000, 'Test Course', FALSE, 1000) ON DUPLICATE KEY UPDATE courseName = 'Test Course'`
    );
  });

  afterAll(async () => {
    if (connection) {
      await connection.query(`DELETE FROM course WHERE courseID = 1000`);
      await connection.query(`DELETE FROM instructor WHERE userID = 1000`);
      await connection.query(`DELETE FROM user WHERE userID = 1000`);
      connection.release();
    }
  });

  test('should successfully delete a course with valid courseID', async () => {
    const { req, res } = mockNextApi('POST', { courseID: 1000 });

    await deleteCourseHandler(req, res, global.pool);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Course deleted successfully' });

    // Verify the course was deleted
    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.query(
      `SELECT * FROM course WHERE courseID = 1000`
    );
    expect(rows.length).toBe(0);
  });

  test('should handle deleting a non-existing course', async () => {
    const { req, res } = mockNextApi('POST', { courseID: 9999 }); // Assume this ID does not exist

    await deleteCourseHandler(req, res, global.pool);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Course deleted successfully' });
  });

  test('should handle foreign key constraints when deleting a course', async () => {
    // Insert a course and associated assignments to test foreign key constraints
    await connection.query(`INSERT INTO course (courseID, courseName, isArchived, instructorID) VALUES (1001, 'Course with Assignments', FALSE, 1000)`);
    await connection.query(`INSERT INTO assignment (assignmentID, title, description, rubric, deadline, groupAssignment, courseID, allowedFileTypes) VALUES (1000, 'Assignment for FK Test', 'Description', 'Rubric', '2024-08-01 23:59:59', FALSE, 1001, 'pdf')`);

    const { req, res } = mockNextApi('POST', { courseID: 1001 });

    await deleteCourseHandler(req, res, global.pool);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Course deleted successfully' });

    // Verify the course and assignments were deleted
    const [courseRows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.query(
      `SELECT * FROM course WHERE courseID = 1001`
    );
    expect(courseRows.length).toBe(0);

    const [assignmentRows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.query(
      `SELECT * FROM assignment WHERE courseID = 1001`
    );
    expect(assignmentRows.length).toBe(0);
  });
});
