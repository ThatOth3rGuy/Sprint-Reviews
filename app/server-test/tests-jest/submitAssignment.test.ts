import mysql from 'mysql2/promise';
import { submitAssignment } from '../../src/db';
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
  });

  beforeEach(async () => {
    // Ensure the user exists
    await connection.query(
      `INSERT INTO user (userID, firstName, lastName, email, pwd, userRole) VALUES 
      (?, 'Test', 'Instructor', 'test.instructor.${uniqueID}@example.com', 'password123', 'instructor'),
      (?, 'Test', 'Student', 'test.student.${uniqueID}@example.com', 'password123', 'student')
      ON DUPLICATE KEY UPDATE email = VALUES(email)`,
      [uniqueID + 1, uniqueID + 2]
    );

    // Ensure the instructor exists
    await connection.query(
      `INSERT INTO instructor (instructorID, userID, isAdmin, departments) VALUES 
      (?, ?, TRUE, 'Test Department')
      ON DUPLICATE KEY UPDATE departments = 'Test Department'`,
      [uniqueID + 1, uniqueID + 1]
    );

    // Ensure the student exists
    await connection.query(
      `INSERT INTO student (userID, studentID, phoneNumber, homeAddress, dateOfBirth) VALUES 
      (?, ?, '555-1234', '123 Test St', '2000-01-01')
      ON DUPLICATE KEY UPDATE phoneNumber = VALUES(phoneNumber)`,
      [uniqueID + 1, uniqueID + 2]
    );

    // Ensure the course exists
    await connection.query(
      `INSERT INTO course (courseID, courseName, isArchived, instructorID) VALUES 
      (?, 'Test Course', FALSE, ?)
      ON DUPLICATE KEY UPDATE courseName = VALUES(courseName)`,
      [uniqueID + 3, uniqueID + 1]
    );

    // Ensure the assignment exists
    await connection.query(
      `INSERT INTO assignment (assignmentID, title, descr, rubric, deadline, groupAssignment, courseID, allowedFileTypes) VALUES 
      (?, 'Test Assignment', 'Test Description', 'Test Rubric', '2024-12-31 23:59:59', FALSE, ?, 'pdf')
      ON DUPLICATE KEY UPDATE title = VALUES(title)`,
      [uniqueID + 4, uniqueID + 3]
    );

    await fs.writeFile(filePath, 'file content');
    jest.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from('file content'));
    jest.spyOn(fs, 'unlink').mockResolvedValue(undefined);
  });

  afterEach(async () => {
    await connection.query(`DELETE FROM submission WHERE assignmentID = ?`, [uniqueID + 4]);
    await connection.query(`DELETE FROM assignment WHERE assignmentID = ?`, [uniqueID + 4]);
    await connection.query(`DELETE FROM course WHERE courseID = ?`, [uniqueID + 3]);
    await connection.query(`DELETE FROM student WHERE userID = ?`, [uniqueID + 2]);
    await connection.query(`DELETE FROM instructor WHERE userID = ?`, [uniqueID + 1]);
    await connection.query(`DELETE FROM user WHERE userID IN (?, ?)`, [uniqueID + 1, uniqueID + 2]);
    await fs.unlink(filePath); // Ensure file cleanup
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (connection) {
      connection.release();
    }
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
      `SELECT * FROM submission WHERE assignmentID = ? AND studentID = ?`, [uniqueID + 4, uniqueID + 2]
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

    const mockReadFile = jest.spyOn(fs, 'readFile').mockRejectedValue(new Error('File read error'));

    await expect(submitAssignment(uniqueID + 4, uniqueID + 2, file, global.pool)).rejects.toThrow('File read error');
    expect(mockReadFile).toHaveBeenCalled();
  });

  test('should handle database errors', async () => {
    const file = {
      path: filePath,
      originalname: 'testFile.pdf',
      mimetype: 'application/pdf',
    } as Express.Multer.File;

    const mockPool = {
      execute: jest.fn().mockRejectedValue(new Error('Simulated database error')),
    };

    await expect(submitAssignment(uniqueID + 4, uniqueID + 2, file, mockPool as unknown as mysql.Pool)).rejects.toThrow('Simulated database error');
  });
});
