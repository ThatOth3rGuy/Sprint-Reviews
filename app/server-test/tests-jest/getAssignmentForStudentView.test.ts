// tests-jest/getAssignmentForStudentView.test.ts
import mysql from 'mysql2/promise';
import { getAssignmentForStudentView } from '../../src/db';

describe('getAssignmentForStudentView Tests', () => {
  let connection: mysql.PoolConnection;
  // Since multiple tests are being run, use a baseID to ensure unique IDs
  // then only test for getting theses specific courses
  const uniqueID = Math.floor(Math.random() * 1000000); // Base value for unique IDs

  beforeAll(async () => {
    connection = await global.pool.getConnection();

    // Ensure the user, instructor, student, course, and assignments exist
    await connection.query(
      `INSERT INTO user (userID, firstName, lastName, email, pwd, userRole) VALUES 
      (${uniqueID + 1}, 'Test', 'Instructor', 'test.instructor@example.com', 'password123', 'instructor')
      ON DUPLICATE KEY UPDATE email = VALUES(email)`
    );

    await connection.query(
      `INSERT INTO instructor (userID, isAdmin, departments) VALUES 
      (${uniqueID + 1}, TRUE, 'Test Department')
      ON DUPLICATE KEY UPDATE departments = 'Test Department'`
    );

    await connection.query(
      `INSERT INTO course (courseID, courseName, isArchived, instructorID) VALUES 
      (${uniqueID + 2}, 'Test Course', FALSE, ${uniqueID + 1})
      ON DUPLICATE KEY UPDATE courseName = VALUES(courseName)`
    );

    await connection.query(
      `INSERT INTO assignment (assignmentID, title, description, rubric, deadline, groupAssignment, courseID, allowedFileTypes) VALUES 
      (${uniqueID + 3}, 'Assignment 1', 'Description 1', 'Rubric 1', '2024-12-31 23:59:59', FALSE, ${uniqueID + 2}, 'pdf,docx')
      ON DUPLICATE KEY UPDATE title = VALUES(title)`
    );
  });

  afterAll(async () => {
    if (connection) {
      await connection.query(`DELETE FROM assignment WHERE assignmentID = ${uniqueID + 3}`);
      await connection.query(`DELETE FROM course WHERE courseID = ${uniqueID + 2}`);
      await connection.query(`DELETE FROM instructor WHERE userID = ${uniqueID + 1}`);
      await connection.query(`DELETE FROM user WHERE userID = ${uniqueID + 1}`);
      connection.release();
    }
  });

  test('should get assignment details for student view', async () => {
    const assignment = await getAssignmentForStudentView(uniqueID + 3, global.pool);

    expect(assignment).toBeDefined();
    expect(assignment).toEqual({
      assignmentID: uniqueID + 3,
      title: 'Assignment 1',
      description: 'Description 1',
      deadline: '2024-12-31T23:59:59.000Z',
      rubric: 'Rubric 1',
      groupAssignment: 0,
      courseID: uniqueID + 2,
      allowedFileTypes: ['pdf', 'docx']
    });
  });

  test('should return null for non-existing assignment', async () => {
    const assignment = await getAssignmentForStudentView(uniqueID + 9999, global.pool); // Assume this ID does not exist

    expect(assignment).toBeNull();
  });
});
