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

export async function query(sql: string, values: any[] = []): Promise<any> {
  try {
    const [result] = await pool.execute(sql, values);
    return result;
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

export async function authenticateAdmin(email: string, password: string): Promise<boolean> {
  const sql = `
    SELECT u.* 
    FROM user u
    JOIN instructor i ON u.userID = i.userID
    WHERE u.email = ? AND u.pwd = ? AND u.userRole = 'instructor' AND i.isAdmin = true
  `;
  try {
    const rows = await query(sql, [email, password]);
    return rows.length > 0;
  } catch (error) {
    console.error('Error in authenticateAdmin:', error); // Log the error
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

export async function getCoursesByStudentID(studentID: number): Promise<any[]> {
  const sql = `SELECT c.courseID, c.courseName, u.firstName AS instructorFirstName
FROM enrollment e
JOIN course c ON e.courseID = c.courseID
JOIN instructor i
JOIN  user u ON i.userID = u.userID
WHERE e.studentID = ?`;
  try {
    console.log('Fetching courses for student:', studentID);
    const rows = await query(sql, [studentID]);
    return rows;
  } catch (error) {
    console.error('Error fetching courses for student:', error);
    throw error;
  }
}
export async function createCourse(courseName: string, instructorID: number) {
  const sql = `
    INSERT INTO course (courseName, isArchived, instructorID)
    VALUES (?, false, ?)
  `;
  try {
    const result = await query(sql, [courseName, instructorID]);
    return result.insertId; // Return the inserted course ID
  } catch (error) {
    console.error('Error in createCourse:', error); // Log the error
    throw error;
  }
}

export async function getCourse(courseID: string): Promise<any> {
  const sql = `
    SELECT * FROM course WHERE courseID = ?
  `;
  try {
    const rows = await query(sql, [courseID]);
    return rows[0];
  } catch (error) {
    console.error('Error in getCourse:', error);
    throw error;
  }
}
  // grab all students from the database matching the first and last name
export async function getStudents(firstName:string, lastName:string) {
  const sql = `
    SELECT * FROM user WHERE firstName = ? AND lastName = ? AND userRole = 'student'
  `;
  try {
    const rows = await query(sql, [firstName, lastName]);
    if (rows.length > 0) {
      return rows[0];
    }
  } catch (error) {
    console.error('Error in getStudents:', error);
    throw error;
  }
}
//  enroll student in a course
export async function enrollStudent(userID: string, courseID: string): Promise<void> {
  const sql = `
    INSERT INTO enrollment (studentID, courseID)
    VALUES (?, ?)
  `;
  try {
    const result = await query(sql, [userID, courseID]);
  } catch (error) {
    const err = error as Error;
    console.error(`Error enrolling student ${userID} in course ${courseID}:`, err.message);
    throw err;
  }
}
