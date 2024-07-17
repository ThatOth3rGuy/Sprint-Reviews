import mysql from 'mysql2/promise';
import deleteCourseHandler from '../../src/pages/api/courses/deleteCourse';
import { mockNextApi } from '../utils/mockNextApi';

describe('deleteCourse API Tests', () => {
  let connection: mysql.PoolConnection;
  // Since multiple tests are being run, use a baseID to ensure unique IDs
  // then only test for getting theses specific courses
  const uniqueID = Math.floor(Math.random() * 1000000); // Base value for unique IDs

  // Setup database connection and initial data before all tests
  beforeAll(async () => {
    try {
      connection = await global.pool.getConnection();
    } catch (error) {
      console.error('Error getting database connection:', error);
      throw error;
    }

    // Insert a test instructor user
    await connection.query(
      `INSERT INTO user (userID, firstName, lastName, email, pwd, userRole) VALUES (${uniqueID + 1}, 'Test', 'Instructor', 'test.instructor@example.com', 'password123', 'instructor') ON DUPLICATE KEY UPDATE email = 'test.instructor@example.com'`
    );

    // Insert the instructor details in the instructor table
    await connection.query(
      `INSERT INTO instructor (instructorID, userID, isAdmin, departments) VALUES (${uniqueID + 1}, ${uniqueID + 1}, TRUE, 'Test Department') ON DUPLICATE KEY UPDATE departments = 'Test Department'`
    );

    // Insert a test course
    await connection.query(
      `INSERT INTO course (courseID, courseName, isArchived, instructorID) VALUES (${uniqueID + 2}, 'Test Course', FALSE, ${uniqueID + 1}) ON DUPLICATE KEY UPDATE courseName = 'Test Course'`
    );
  });

  // Clean up the database after all tests
  afterAll(async () => {
    if (connection) {
      // Delete the test data from the course, instructor, and user tables
      await connection.query(`DELETE FROM course WHERE courseID IN (${uniqueID + 2}, ${uniqueID + 3}, ${uniqueID + 4})`);
      await connection.query(`DELETE FROM instructor WHERE instructorID = ${uniqueID + 1}`);
      await connection.query(`DELETE FROM user WHERE userID = ${uniqueID + 1}`);
      connection.release(); // Release the connection back to the pool
    }
  });

  // Test case to delete a course with a valid course ID
  test('should successfully delete a course with valid courseID', async () => {
    const { req, res } = mockNextApi('POST', { courseID: uniqueID + 2 }); 

    await deleteCourseHandler(req, res, global.pool);

    expect(res.statusCode).toBe(200); 
    expect(JSON.parse(res._getData())).toEqual({ message: 'Course deleted successfully' });

    // Verify the course was deleted
    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.query(
      `SELECT * FROM course WHERE courseID = ${uniqueID + 2}`
    );
    expect(rows.length).toBe(0); // Ensure no rows are returned, meaning the course was deleted
  });

  // Test case to handle deletion of a non-existing course
  test('should handle deleting a non-existing course', async () => {
    const { req, res } = mockNextApi('POST', { courseID: uniqueID + 9999 }); 

    await deleteCourseHandler(req, res, global.pool);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Course deleted successfully' }); 
  });

  // Test case to handle foreign key constraints when deleting a course
  test('should handle foreign key constraints when deleting a course', async () => {
    // Insert a course and associated assignments to test foreign key constraints
    await connection.query(`INSERT INTO course (courseID, courseName, isArchived, instructorID) VALUES (${uniqueID + 3}, 'Course with Assignments', FALSE, ${uniqueID + 1})`);
    await connection.query(`INSERT INTO assignment (assignmentID, title, descr, rubric, deadline, groupAssignment, courseID, allowedFileTypes) VALUES (${uniqueID + 4}, 'Assignment for FK Test', 'Description', 'Rubric', '2024-08-01 23:59:59', FALSE, ${uniqueID + 3}, 'pdf,docx')`);

    const { req, res } = mockNextApi('POST', { courseID: uniqueID + 3 }); 

    await deleteCourseHandler(req, res, global.pool);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Course deleted successfully' }); 
    
    // Verify the course was deleted
    const [courseRows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.query(
      `SELECT * FROM course WHERE courseID = ${uniqueID + 3}`
    );
    expect(courseRows.length).toBe(0); // Ensure no rows are returned, meaning the course was deleted

    // Verify the associated assignments were deleted
    const [assignmentRows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.query(
      `SELECT * FROM assignment WHERE courseID = ${uniqueID + 3}`
    );
    expect(assignmentRows.length).toBe(0); // Ensure no rows are returned, meaning the assignments were deleted
  });
});
