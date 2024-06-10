import mysql from 'mysql2/promise';
import '@testing-library/jest-dom'

let pool: mysql.Pool;

beforeAll(async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'SprintRunners',
      database: process.env.DB_NAME || 'mydb',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    (global as any).pool = pool;
  } catch (error) {
    console.error('Error setting up database pool:', error);
    throw error;
  }
});

afterAll(async () => {
  if (pool) {
    await pool.end();
  }
});
