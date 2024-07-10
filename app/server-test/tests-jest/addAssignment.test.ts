// tests-jest/addAssignment.test.ts
import mysql from 'mysql2/promise';
import { addAssignmentToDatabase } from '../../src/db';

describe('addAssignmentToDatabase Tests', () => {
  let connection: mysql.PoolConnection;

  test('should successfully add an assignment with valid data', async () => {
    const title = 'Test Assignment';
    const description = 'This is a test assignment';
    const dueDate = '2024-12-31';
    const file = 'test-file.pdf';
    const groupAssignment = false;
    const courseID = 1;
    const allowedFileTypes = ['pdf'];

    try {
      const result = await addAssignmentToDatabase(
        title,
        description,
        dueDate,
        file,
        groupAssignment,
        courseID,
        allowedFileTypes,
        global.pool
      );

      expect(result).toHaveProperty('insertId');

      try {
        connection = await global.pool.getConnection();

        const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.query(
          `SELECT * FROM assignment 
          WHERE title = ? 
          AND description = ? 
          AND deadline = ? 
          AND rubric = ? 
          AND groupAssignment = ? 
          AND courseID = ? 
          AND allowedFileTypes = ?`,
          [title, description, new Date(dueDate), file, groupAssignment, courseID, allowedFileTypes.join(',')]
        );

        expect(rows).toBeDefined();
        expect(rows.length).toBeGreaterThan(0);

        // Clean up: Delete the inserted assignment
        await connection.query(
          `DELETE FROM assignment WHERE title = ? AND description = ? AND deadline = ? AND rubric = ? AND groupAssignment = ? AND courseID = ? AND allowedFileTypes = ?`,
          [title, description, new Date(dueDate), file, groupAssignment, courseID, allowedFileTypes.join(',')]
        );

      } catch (error) {
        console.error('Error getting database connection:', error);
        throw error;
      } finally {
        if (connection) connection.release();
      }

    } catch (error) {
      if (error instanceof Error) {
        console.error('Error in addAssignmentToDatabase with valid data:', error.message);
        throw error;
      } else {
        console.error('Unknown error in addAssignmentToDatabase with valid data:', error);
        throw new Error('Unknown error occurred');
      }
    }
  });

  test('should throw an error for invalid courseID', async () => {
    const title = 'Test Assignment';
    const description = 'This is a test assignment';
    const dueDate = '2024-12-31';
    const file = 'test-file.pdf';
    const groupAssignment = false;
    const invalidCourseID = 'invalidID' as any;
    const allowedFileTypes = ['pdf'];

    await expect(addAssignmentToDatabase(
      title,
      description,
      dueDate,
      file,
      groupAssignment,
      invalidCourseID,
      allowedFileTypes,
      global.pool
    )).rejects.toThrow('Invalid courseID');
  });

  test('should throw an error if no class is found with the given courseID', async () => {
    const title = 'Test Assignment';
    const description = 'This is a test assignment';
    const dueDate = '2024-12-31';
    const file = 'test-file.pdf';
    const groupAssignment = false;
    const nonExistentCourseID = 999; // Assume this ID does not exist in the database
    const allowedFileTypes = ['pdf'];

    try {
      await addAssignmentToDatabase(
        title,
        description,
        dueDate,
        file,
        groupAssignment,
        nonExistentCourseID,
        allowedFileTypes,
        global.pool
      );
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(`No class found with ID ${nonExistentCourseID}`);
      } else {
        console.error('Unknown error in addAssignmentToDatabase:', error);
        throw new Error('Unknown error occurred');
      }
    }
  });

  test('should handle errors during database operations', async () => {
    const title = 'Test Assignment';
    const description = 'This is a test assignment';
    const dueDate = '2024-12-31';
    const file = 'test-file.pdf';
    const groupAssignment = false;
    const courseID = 1;
    const allowedFileTypes = ['pdf'];

    // Create a pool with incorrect connection information
    const faultyPool = mysql.createPool({
      host: 'invalid-host',
      port: 9999,
      user: 'wrong-user',
      password: 'wrong-password',
      database: 'wrong-database',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    try {
      await expect(addAssignmentToDatabase(
        title,
        description,
        dueDate,
        file,
        groupAssignment,
        courseID,
        allowedFileTypes,
        faultyPool
      )).rejects.toThrow();

    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('ER_HOST_NOT_PRIVILEGED');  // Adjust error message based on actual error
      } else {
        console.error('Unknown error in addAssignmentToDatabase:', error);
        throw new Error('Unknown error occurred');
      }
    } finally {
      // Ensure the faulty pool is closed after the test
      await faultyPool.end();
    }
  });

});
