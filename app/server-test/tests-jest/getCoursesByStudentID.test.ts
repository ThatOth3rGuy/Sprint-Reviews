// tests-jest/getCoursesByStudentID.test.ts
import mysql from 'mysql2/promise';
import { getCoursesByStudentID } from '../../src/db';

describe('getCoursesByStudentID Tests', () => {
  let connection: mysql.PoolConnection;
  // Since multiple tests are being run, use a baseID to ensure unique IDs
  // then only test for getting theses specific courses
  const uniqueID = Math.floor(Math.random() * 1000000); // Base value for unique IDs

  beforeAll(async () => {
    connection = await global.pool.getConnection();

    // Ensure the user, instructor, student, course, and enrollment exist
    await connection.query(
      `INSERT INTO user (userID, firstName, lastName, email, pwd, userRole) VALUES 
      (${uniqueID + 1}, 'Test', 'Instructor', 'test.instructor@example.com', 'password123', 'instructor'),
      (${uniqueID + 2}, 'Test', 'Student', 'test.student@example.com', 'password123', 'student')
      ON DUPLICATE KEY UPDATE email = VALUES(email)`
    );

    await connection.query(
      `INSERT INTO instructor (userID, isAdmin, departments) VALUES 
      (${uniqueID + 1}, TRUE, 'Test Department')
      ON DUPLICATE KEY UPDATE departments = 'Test Department'`
    );

    await connection.query(
      `INSERT INTO student (userID, studentID, phoneNumber, homeAddress, dateOfBirth) VALUES 
      (${uniqueID + 2}, ${uniqueID + 2}, '1234567890', '123 Test St', '2000-01-01')
      ON DUPLICATE KEY UPDATE phoneNumber = '1234567890'`
    );

    await connection.query(
      `INSERT INTO course (courseID, courseName, isArchived, instructorID) VALUES 
      (${uniqueID + 3}, 'Test Course 1', FALSE, ${uniqueID + 1}),
      (${uniqueID + 4}, 'Test Course 2', FALSE, ${uniqueID + 1})
      ON DUPLICATE KEY UPDATE courseName = VALUES(courseName)`
    );

    await connection.query(
      `INSERT INTO enrollment (studentID, courseID) VALUES 
      (${uniqueID + 2}, ${uniqueID + 3}),
      (${uniqueID + 2}, ${uniqueID + 4})
      ON DUPLICATE KEY UPDATE studentID = VALUES(studentID)`
    );
  });

  afterAll(async () => {
    if (connection) {
      await connection.query(`DELETE FROM enrollment WHERE studentID = ${uniqueID + 2}`);
      await connection.query(`DELETE FROM course WHERE courseID IN (${uniqueID + 3}, ${uniqueID + 4})`);
      await connection.query(`DELETE FROM student WHERE userID = ${uniqueID + 2}`);
      await connection.query(`DELETE FROM instructor WHERE userID = ${uniqueID + 1}`);
      await connection.query(`DELETE FROM user WHERE userID IN (${uniqueID + 1}, ${uniqueID + 2})`);
      connection.release();
    }
  });

  test('should fetch courses by student ID', async () => {
    const courses = await getCoursesByStudentID(uniqueID + 2, global.pool);

    expect(courses.length).toBe(2);
    expect(courses).toEqual([
      {
        courseID: uniqueID + 3,
        courseName: 'Test Course 1',
        instructorFirstName: 'Test',
      },
      {
        courseID: uniqueID + 4,
        courseName: 'Test Course 2',
        instructorFirstName: 'Test',
      }
    ]);
  });

  test('should return an empty array for a student with no courses', async () => {
    const newStudentID = uniqueID + 5;
    await connection.query(
      `INSERT INTO user (userID, firstName, lastName, email, pwd, userRole) VALUES 
      (${newStudentID}, 'New', 'Student', 'new.student@example.com', 'password123', 'student')
      ON DUPLICATE KEY UPDATE email = VALUES(email)`
    );
    await connection.query(
      `INSERT INTO student (userID, studentID, phoneNumber, homeAddress, dateOfBirth) VALUES 
      (${newStudentID}, ${newStudentID}, '1234567890', '123 New St', '2000-01-01')
      ON DUPLICATE KEY UPDATE phoneNumber = '1234567890'`
    );

    const courses = await getCoursesByStudentID(newStudentID, global.pool);

    expect(courses.length).toBe(0);

    // Clean up
    await connection.query(`DELETE FROM student WHERE userID = ${newStudentID}`);
    await connection.query(`DELETE FROM user WHERE userID = ${newStudentID}`);
  });

  test('should handle errors during course fetching', async () => {
    try {
      // Simulate a database error by providing an invalid pool
      await getCoursesByStudentID(uniqueID + 2, {} as mysql.Pool);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
