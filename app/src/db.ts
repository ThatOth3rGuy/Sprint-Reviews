// db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'SprintRunners',
  database: process.env.DB_NAME || 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function query(sql: string, values: any[] = []): Promise<any[]> {
  try {
    const [rows] = await pool.execute(sql, values);
    return rows as any[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function addInstructorToDatabase(firstName: string, lastName: string, email: string, password: string, role: string) {
  const sql = `
    INSERT INTO user (firstName, lastName, email, pwd, userRole)
    VALUES (?, ?, ?, ?, ?)
  `;
  try {
    await query(sql, [firstName, lastName, email, password, role]);
  } catch (error) {
    console.error('Error in addUserToDatabase:', error); // Log the error
    throw error;
  }
}

export async function addStudentToDatabase(firstName: string, lastName: string, email: string, password: string, role: string, institution: string) {
  const sql = `
    INSERT INTO user (firstName, lastName, email, pwd, userRole, institution)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    await query(sql, [firstName, lastName, email, password, role, institution]);
  } catch (error) {
    console.error('Error in addUserToDatabase:', error); // Log the error
    throw error;
  }
}

export async function authenticateInstructor(email: string, password: string): Promise<boolean> {
  const sql = `
    SELECT * FROM user WHERE email = ? AND pwd = ? AND userRole = 'instructor'
  `;
  try {
    const rows = await query(sql, [email, password]);
    return rows.length > 0;
  } catch (error) {
    console.error('Error in authenticateInstructor:', error); // Log the error
    throw error;
  }
}

export async function authenticateStudent(email: string, password: string): Promise<boolean> {
  const sql = `
    SELECT * FROM user WHERE email = ? AND pwd = ? AND userRole = 'student'
  `;
  try {
    const rows = await query(sql, [email, password]);
    return rows.length > 0;
  } catch (error) {
    console.error('Error in authenticateStudent:', error); // Log the error
    throw error;
  }
}
export async function addAssignmentToDatabase(title: string, description: string, dueDate: string, classID: number, file:string) {
  const sql = `
    INSERT INTO assignment (title, description, deadline, classID)
    VALUES (?, ?, ?, ?)
  `;
  try {
    await query(sql, [title, description, new Date(dueDate), classID, file]);
  } catch (error) {
    console.error('Error in addAssignmentToDatabase:', error); // Log the error
    throw error;
  }
}
export async function getAssignments(): Promise<any[]> {
  const sql = 'SELECT * FROM assignment';
  try {
    const rows = await query(sql);
    return rows as any[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
