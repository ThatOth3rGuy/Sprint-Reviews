import '@testing-library/jest-dom';
import { TextEncoder as UtilTextEncoder, TextDecoder as UtilTextDecoder } from 'util';
import mysql from 'mysql2/promise';

// Casting to any to avoid type mismatch errors
global.TextEncoder = UtilTextEncoder as any;
global.TextDecoder = UtilTextDecoder as any;

let pool: mysql.Pool;

beforeAll(async () => {
  try {
    const host = process.env.MYSQLDB_HOST || 'localhost';

    pool = mysql.createPool({
      host: host,
      port: 3309,
      user: process.env.MYSQLDB_USER || 'root',
      password: process.env.MYSQLDB_PASSWORD || 'SprintRunnersTest',
      database: process.env.MYSQLDB_DATABASE || 'testdb',
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
