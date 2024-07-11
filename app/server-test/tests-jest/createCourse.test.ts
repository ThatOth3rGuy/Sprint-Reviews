// tests-jest/createCourse.test.ts
import mysql from 'mysql2/promise';
import { createCourse } from '../../src/db';

describe('createCourse Tests', () => {
  let connection: mysql.PoolConnection;

  test('should successfully create a course with valid data', async () => {
    const courseName = 'Test Course';
    const instructorID = 3;

    try {
      const courseID = await createCourse(courseName, instructorID, global.pool);

      expect(courseID).toBeDefined();
      expect(courseID).toBeGreaterThan(0);

      // Verify the course was created
      connection = await global.pool.getConnection();
      const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.query(
        `SELECT * FROM course WHERE courseID = ?`,
        [courseID]
      );

      expect(rows).toBeDefined();
      expect(rows.length).toBe(1);
      expect(rows[0].courseName).toBe(courseName);
      expect(rows[0].instructorID).toBe(instructorID);
      expect(rows[0].isArchived).toBe(0);

      // Clean up: Delete the created course
      await connection.query(`DELETE FROM course WHERE courseID = ?`, [courseID]);
    } catch (error) {
      console.error('Error in createCourse with valid data:', error);
      throw error;
    }
  });

  test('should throw an error if instructorID is invalid', async () => {
    const courseName = 'Test Course';
    const invalidInstructorID = 9999;

    await expect(createCourse(courseName, invalidInstructorID)).rejects.toThrow();
  });

  test('should handle database operation errors', async () => {
    const courseName = 'Test Course';
    const instructorID = 1;

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
      await expect(createCourse(courseName, instructorID, faultyPool)).rejects.toThrow();
    } catch (error) {
      console.error('Unknown error in createCourse:', error);
      throw new Error('Unknown error occurred');
    } finally {
      // Ensure the faulty pool is closed after the test
      await faultyPool.end();
    }
  });
});
