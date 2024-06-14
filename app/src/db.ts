// db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'SprintRunners',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function query(sql: string, values: any[] = []) {
  const [rows] = await pool.execute(sql, values);
  return rows;
}