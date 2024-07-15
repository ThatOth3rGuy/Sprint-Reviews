// tests-jest/getAssignmentsWithSubmissions.test.ts
import mysql from 'mysql2/promise';
import { getAssignmentsWithSubmissions } from '../../src/db'; // Adjust the import path as necessary

describe('getAssignmentsWithSubmissions Tests', () => {
  let connection: mysql.PoolConnection;
  // Since multiple tests are being run, use a baseID to ensure unique IDs
  // then only test for getting theses specific courses
  const uniqueID = Math.floor(Math.random() * 1000000); // Base value for unique IDs

  beforeAll(async () => {
    connection = await global.pool.getConnection();

    // Ensure the user, instructor, student, course, assignments, and submissions exist
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
      (${uniqueID + 3}, 'Test Course', FALSE, ${uniqueID + 1})
      ON DUPLICATE KEY UPDATE courseName = VALUES(courseName)`
    );

    await connection.query(
      `INSERT INTO assignment (assignmentID, title, description, rubric, deadline, groupAssignment, courseID, allowedFileTypes) VALUES 
      (${uniqueID + 4}, 'Assignment 1', 'Description 1', 'Rubric 1', '2024-12-31 23:59:59', FALSE, ${uniqueID + 3}, 'pdf,docx')
      ON DUPLICATE KEY UPDATE title = VALUES(title)`
    );

    await connection.query(
      `INSERT INTO submission (submissionID, assignmentID, studentID, fileName, submissionDate) VALUES 
      (${uniqueID + 5}, ${uniqueID + 4}, ${uniqueID + 2}, 'submission1.pdf', '2024-12-01 12:00:00')
      ON DUPLICATE KEY UPDATE fileName = VALUES(fileName)`
    );
  });

  afterAll(async () => {
    if (connection) {
      await connection.query(`DELETE FROM submission WHERE submissionID = ${uniqueID + 5}`);
      await connection.query(`DELETE FROM assignment WHERE assignmentID = ${uniqueID + 4}`);
      await connection.query(`DELETE FROM course WHERE courseID = ${uniqueID + 3}`);
      await connection.query(`DELETE FROM student WHERE userID = ${uniqueID + 2}`);
      await connection.query(`DELETE FROM instructor WHERE userID = ${uniqueID + 1}`);
      await connection.query(`DELETE FROM user WHERE userID IN (${uniqueID + 1}, ${uniqueID + 2})`);
      connection.release();
    }
  });

  test('should fetch assignments with submissions', async () => {
    const assignments = await getAssignmentsWithSubmissions(global.pool);

    const assignment = assignments.find((assignment: { assignmentID: number }) => assignment.assignmentID === uniqueID + 4);

    expect(assignment).toBeDefined();
    expect(assignment).toEqual({
      assignmentID: uniqueID + 4,
      title: 'Assignment 1',
      description: 'Description 1',
      deadline: '2024-12-31T23:59:59.000Z',
      rubric: 'Rubric 1',
      allowedFileTypes: ['pdf', 'docx'],
      submissions: [{
        studentID: uniqueID + 2,
        submissionDate: '2024-12-01T12:00:00.000Z',
        file: 'submission1.pdf'
      }]
    });
  });

  test('should handle assignments with no submissions', async () => {
    // Insert an assignment with no submissions
    await connection.query(
      `INSERT INTO assignment (assignmentID, title, description, rubric, deadline, groupAssignment, courseID, allowedFileTypes) VALUES 
      (${uniqueID + 6}, 'Assignment 2', 'Description 2', 'Rubric 2', '2024-12-31 23:59:59', FALSE, ${uniqueID + 3}, 'pdf,docx')
      ON DUPLICATE KEY UPDATE title = VALUES(title)`
    );

    const assignments = await getAssignmentsWithSubmissions(global.pool);

    const assignment = assignments.find((assignment: { assignmentID: number }) => assignment.assignmentID === uniqueID + 6);

    expect(assignment).toBeDefined();
    expect(assignment).toEqual({
      assignmentID: uniqueID + 6,
      title: 'Assignment 2',
      description: 'Description 2',
      deadline: '2024-12-31T23:59:59.000Z',
      rubric: 'Rubric 2',
      allowedFileTypes: ['pdf', 'docx'],
      submissions: []
    });

    // Clean up
    await connection.query(`DELETE FROM assignment WHERE assignmentID = ${uniqueID + 6}`);
  });
});
