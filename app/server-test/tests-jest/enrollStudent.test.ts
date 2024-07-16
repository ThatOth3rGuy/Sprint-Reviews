// tests-jest/enrollStudent.test.ts
import mysql from 'mysql2/promise';
import { enrollStudent } from '../../src/db';

describe('enrollStudent Tests', () => {
  let connection: mysql.PoolConnection;

  beforeAll(async () => {
    connection = await global.pool.getConnection();

    // Ensure the user exists for both student and instructor
    await connection.query(
      `INSERT INTO user (userID, firstName, lastName, email, pwd, userRole) VALUES 
      (1000, 'Test', 'Student', 'test.student@example.com', 'password123', 'student'),
      (1001, 'Test', 'Instructor', 'test.instructor@example.com', 'password123', 'instructor')
      ON DUPLICATE KEY UPDATE email = VALUES(email)`
    );

    // Ensure the student exists
    await connection.query(
        `INSERT INTO student (userID, studentID, phoneNumber, homeAddress, dateOfBirth) VALUES 
        (1000, 1000, '1234567890', '123 Test St', '2000-01-01')
        ON DUPLICATE KEY UPDATE phoneNumber = '1234567890'`
    );

    // Ensure the instructor exists
    await connection.query(
      `INSERT INTO instructor (userID, isAdmin, departments) VALUES (1001, TRUE, 'Test Department') ON DUPLICATE KEY UPDATE departments = 'Test Department'`
    );

    // Ensure the course exists
    await connection.query(
      `INSERT INTO course (courseID, courseName, isArchived, instructorID) VALUES (2000, 'Test Course', FALSE, 1001) ON DUPLICATE KEY UPDATE courseName = 'Test Course'`
    );
  });

  afterAll(async () => {
    if (connection) {
      await connection.query(`DELETE FROM enrollment WHERE studentID = 1000 AND courseID = 2000`);
      await connection.query(`DELETE FROM course WHERE courseID = 2000`);
      await connection.query(`DELETE FROM instructor WHERE userID = 1001`);
      await connection.query(`DELETE FROM user WHERE userID IN (1000, 1001)`);
      connection.release();
    }
  });

  test('should enroll a student successfully', async () => {
    const userID = '1000';
    const courseID = '2000';

    await enrollStudent(userID, courseID, global.pool);

    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.query(
      `SELECT * FROM enrollment WHERE studentID = ? AND courseID = ?`,
      [userID, courseID]
    );

    expect(rows.length).toBe(1);
    expect(rows[0].studentID).toBe(parseInt(userID));
    expect(rows[0].courseID).toBe(parseInt(courseID));
  });

  test('should handle errors during enrollment', async () => {
    const userID = '1000';
    const invalidCourseID = '9999'; // Assume this ID does not exist

    await expect(enrollStudent(userID, invalidCourseID, global.pool)).rejects.toThrow();

    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.query(
      `SELECT * FROM enrollment WHERE studentID = ? AND courseID = ?`,
      [userID, invalidCourseID]
    );

    expect(rows.length).toBe(0);
  });
});