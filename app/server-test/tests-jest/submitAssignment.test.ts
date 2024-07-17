import mysql from 'mysql2/promise';
import { submitAssignment } from '../../src/db'; // Adjust the import path as necessary
import * as fs from 'fs/promises';
import path from 'path';
import { jest } from '@jest/globals';

jest.mock('fs/promises');

describe('submitAssignment Tests', () => {
  let connection: mysql.PoolConnection;
  const uniqueID = Math.floor(Math.random() * 1000000); // Base value for unique IDs
  const filePath = path.join(__dirname, '../test-files/testFile.pdf');

  beforeAll(async () => {
    connection = await global.pool.getConnection();

    // Ensure the user exists
    await connection.query(
      `INSERT INTO user (userID, firstName, lastName, email, pwd, userRole) VALUES 
      (${uniqueID + 1}, 'Test', 'Instructor', 'test.instructor@example.com', 'password123', 'instructor')
      ON DUPLICATE KEY UPDATE email = VALUES(email)`
    );

    // Ensure the instructor exists
    await connection.query(
      `INSERT INTO instructor (userID, isAdmin, departments) VALUES 
      (${uniqueID + 1}, TRUE, 'Test Department')
      ON DUPLICATE KEY UPDATE departments = 'Test Department'`
    );

    // Ensure the student exists
    await connection.query(
      `INSERT INTO user (userID, firstName, lastName, email, pwd, userRole) VALUES 
      (${uniqueID + 2}, 'Test', 'Student', 'test.student@example.com', 'password123', 'student')
      ON DUPLICATE KEY UPDATE email = VALUES(email)`
    );

    await connection.query(
      `INSERT INTO student (userID, studentID, phoneNumber, homeAddress, dateOfBirth) VALUES 
      (${uniqueID + 2}, ${uniqueID + 2}, '555-1234', '123 Test St', '2000-01-01')
      ON DUPLICATE KEY UPDATE phoneNumber = VALUES(phoneNumber)`
    );

    // Ensure the course exists
    await connection.query(
      `INSERT INTO course (courseID, courseName, isArchived, instructorID) VALUES 
      (${uniqueID + 3}, 'Test Course', FALSE, ${uniqueID + 1})
      ON DUPLICATE KEY UPDATE courseName = VALUES(courseName)`
    );

    // Ensure the assignment exists
    await connection.query(
      `INSERT INTO assignment (assignmentID, title, description, rubric, deadline, groupAssignment, courseID, allowedFileTypes) VALUES 
      (${uniqueID + 4}, 'Test Assignment', 'Test Description', 'Test Rubric', '2024-12-31 23:59:59', FALSE, ${uniqueID + 3}, 'pdf')
      ON DUPLICATE KEY UPDATE title = VALUES(title)`
    );
  });

  afterAll(async () => {
    if (connection) {
      await connection.query(`DELETE FROM submission WHERE assignmentID = ${uniqueID + 4}`);
      await connection.query(`DELETE FROM assignment WHERE assignmentID = ${uniqueID + 4}`);
      await connection.query(`DELETE FROM course WHERE courseID = ${uniqueID + 3}`);
      await connection.query(`DELETE FROM student WHERE userID = ${uniqueID + 2}`);
      await connection.query(`DELETE FROM instructor WHERE userID = ${uniqueID + 1}`);
      await connection.query(`DELETE FROM user WHERE userID IN (${uniqueID + 1}, ${uniqueID + 2})`);
      connection.release();
    }
  });

  beforeEach(async () => {
    await fs.writeFile(filePath, 'file content');
    jest.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from('file content'));
    jest.spyOn(fs, 'unlink').mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should submit an assignment successfully', async () => {
    const file = {
      path: filePath,
      originalname: 'testFile.pdf',
      mimetype: 'application/pdf',
    } as Express.Multer.File;

    const response = await submitAssignment(uniqueID + 4, uniqueID + 2, file, global.pool);

    expect(response).toEqual({ success: true, message: 'Assignment submitted successfully' });

    // Verify the submission was inserted into the database
    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.query(
      `SELECT * FROM submission WHERE assignmentID = ${uniqueID + 4} AND studentID = ${uniqueID + 2}`
    );
    expect(rows.length).toBe(1);
    expect(rows[0].fileName).toBe('testFile.pdf');
  });

  test('should handle file reading errors', async () => {
    const file = {
      path: filePath,
      originalname: 'testFile.pdf',
      mimetype: 'application/pdf',
    } as Express.Multer.File;

    jest.spyOn(fs, 'readFile').mockRejectedValue(new Error('File read error'));

    await expect(submitAssignment(uniqueID + 4, uniqueID + 2, file, global.pool)).rejects.toThrow('File read error');
  });

  test('should handle database errors', async () => {
    const file = {
      path: filePath,
      originalname: 'testFile.pdf',
      mimetype: 'application/pdf',
    } as Express.Multer.File;

    const mockPool = {
      execute: jest.fn().mockImplementation(() => {
        throw new Error('Simulated database error');
      }),
    };

    await expect(submitAssignment(uniqueID + 4, uniqueID + 2, file, mockPool as unknown as mysql.Pool)).rejects.toThrow('Simulated database error');
  });
});
