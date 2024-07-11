// tests-jest/getAllCourses.test.ts
import mysql from 'mysql2/promise';
import { getAllCourses } from '../../src/db';

describe('getAllCourses Tests', () => {
  let connection: mysql.PoolConnection;

  // Since multiple tests are being run, use a baseID to ensure unique IDs
  // then only test for getting theses specific courses
  const baseID = Math.floor(Math.random() * 1000000); // Base value for unique IDs

  beforeAll(async () => {
    connection = await global.pool.getConnection();

    // Ensure the user, instructor, student, course, assignment, and submission exist
    await connection.query(
      `INSERT INTO user (userID, firstName, lastName, email, pwd, userRole) VALUES 
      (${baseID + 1}, 'Test', 'Instructor', 'test.instructor@example.com', 'password123', 'instructor'),
      (${baseID + 2}, 'Test', 'Student', 'test.student@example.com', 'password123', 'student')
      ON DUPLICATE KEY UPDATE email = VALUES(email)`
    );

    await connection.query(
      `INSERT INTO instructor (userID, isAdmin, departments) VALUES 
      (${baseID + 1}, TRUE, 'Test Department')
      ON DUPLICATE KEY UPDATE departments = 'Test Department'`
    );

    await connection.query(
      `INSERT INTO student (userID, studentID, phoneNumber, homeAddress, dateOfBirth) VALUES 
      (${baseID + 2}, ${baseID + 2}, '1234567890', '123 Test St', '2000-01-01')
      ON DUPLICATE KEY UPDATE phoneNumber = '1234567890'`
    );

    await connection.query(
      `INSERT INTO course (courseID, courseName, isArchived, instructorID) VALUES 
      (${baseID + 3}, 'Active Course', FALSE, ${baseID + 1}),
      (${baseID + 4}, 'Archived Course', TRUE, ${baseID + 1})
      ON DUPLICATE KEY UPDATE courseName = VALUES(courseName)`
    );

    await connection.query(
      `INSERT INTO assignment (assignmentID, title, description, rubric, deadline, groupAssignment, courseID, allowedFileTypes) VALUES 
      (${baseID + 5}, 'Assignment 1', 'Description 1', 'Rubric 1', '2024-12-31 23:59:59', FALSE, ${baseID + 3}, 'pdf'),
      (${baseID + 6}, 'Assignment 2', 'Description 2', 'Rubric 2', '2024-12-31 23:59:59', FALSE, ${baseID + 4}, 'pdf')
      ON DUPLICATE KEY UPDATE title = VALUES(title)`
    );

    await connection.query(
      `INSERT INTO submission (submissionID, assignmentID, studentID, fileName, fileContent, fileType, submissionDate, grade) VALUES 
      (${baseID + 7}, ${baseID + 5}, ${baseID + 2}, 'file1.pdf', NULL, 'pdf', '2024-12-31 23:59:59', 85),
      (${baseID + 8}, ${baseID + 6}, ${baseID + 2}, 'file2.pdf', NULL, 'pdf', '2024-12-31 23:59:59', 90)
      ON DUPLICATE KEY UPDATE fileName = VALUES(fileName)`
    );
  });

  afterAll(async () => {
    if (connection) {
      await connection.query(`DELETE FROM submission WHERE submissionID IN (${baseID + 7}, ${baseID + 8})`);
      await connection.query(`DELETE FROM assignment WHERE assignmentID IN (${baseID + 5}, ${baseID + 6})`);
      await connection.query(`DELETE FROM course WHERE courseID IN (${baseID + 3}, ${baseID + 4})`);
      await connection.query(`DELETE FROM student WHERE userID = ${baseID + 2}`);
      await connection.query(`DELETE FROM instructor WHERE userID = ${baseID + 1}`);
      await connection.query(`DELETE FROM user WHERE userID IN (${baseID + 1}, ${baseID + 2})`);
      connection.release();
    }
  });

  test('should get all active courses', async () => {
    const courses = await getAllCourses(false, global.pool);

    const activeCourse = courses.find(course => course.courseID === baseID + 3);
    expect(activeCourse).toBeDefined();
    expect(activeCourse).toEqual({
      courseID: baseID + 3,
      courseName: 'Active Course',
      instructorFirstName: 'Test',
      instructorLastName: 'Instructor',
      averageGrade: 85,
    });
  });

  test('should get all archived courses', async () => {
    const courses = await getAllCourses(true, global.pool);

    const archivedCourse = courses.find(course => course.courseID === baseID + 4);
    expect(archivedCourse).toBeDefined();
    expect(archivedCourse).toEqual({
      courseID: baseID + 4,
      courseName: 'Archived Course',
      instructorFirstName: 'Test',
      instructorLastName: 'Instructor',
      averageGrade: 90,
    });
  });

  test('should handle no test-specific courses found', async () => {
    // Ensure only test-specific courses are deleted
    await connection.query(`DELETE FROM course WHERE courseID IN (${baseID + 3}, ${baseID + 4})`);

    const courses = await getAllCourses(false, global.pool);
    const activeCourse = courses.find(course => course.courseID === baseID + 3);
    const archivedCourses = await getAllCourses(true, global.pool);
    const archivedCourse = archivedCourses.find(course => course.courseID === baseID + 4);

    expect(activeCourse).toBeUndefined();
    expect(archivedCourse).toBeUndefined();

    // Reinsert courses for cleanup
    await connection.query(
      `INSERT INTO course (courseID, courseName, isArchived, instructorID) VALUES 
      (${baseID + 3}, 'Active Course', FALSE, ${baseID + 1}),
      (${baseID + 4}, 'Archived Course', TRUE, ${baseID + 1})
      ON DUPLICATE KEY UPDATE courseName = VALUES(courseName)`
    );
  });
});
