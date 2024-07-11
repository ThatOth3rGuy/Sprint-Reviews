import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'db',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'SprintRunners',
  database: process.env.DATABASE_NAME || 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function query(sql: string, values: any[] = [], customPool: mysql.Pool = pool): Promise<any> {
  try {
    const [result] = await customPool.execute(sql, values);
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

export async function authenticateAdmin(email: string, password: string, customPool?: mysql.Pool): Promise<boolean> {
  const sql = `
    SELECT u.* 
    FROM user u
    JOIN instructor i ON u.userID = i.userID
    WHERE u.email = ? AND u.pwd = ? AND u.userRole = 'instructor' AND i.isAdmin = true
  `;
  try {
    const rows = await query(sql, [email, password], customPool);
    const isAuthenticated = rows.length > 0;
    return isAuthenticated;
  } catch (error) {
    console.error('Error in authenticateAdmin:', error);
    throw error;
  }
}

export async function authenticateInstructor(email: string, password: string, customPool?: mysql.Pool): Promise<boolean> {
  const sql = `
    SELECT * FROM user WHERE email = ? AND pwd = ? AND userRole = 'instructor'
  `;
  try {
    const rows = await query(sql, [email, password], customPool);
    const isAuthenticated = rows.length > 0;
    return isAuthenticated;
  } catch (error) {
    console.error('Error in authenticateInstructor:', error);
    throw error;
  }
}

export async function authenticateStudent(email: string, password: string, customPool?: mysql.Pool): Promise<boolean> {
  const sql = `
    SELECT * FROM user WHERE email = ? AND pwd = ? AND userRole = 'student'
  `;
  try {
    const rows = await query(sql, [email, password], customPool);
    const isAuthenticated = rows.length > 0;
    return isAuthenticated;
  } catch (error) {
    console.error('Error in authenticateStudent:', error); // Log the error
    throw error;
  }
}

export async function getAllCourses(isArchived: boolean, customPool?: mysql.Pool): Promise<any[]> {
  const sql = `
    SELECT 
      course.courseID,
      course.courseName,
      user.firstName AS instructorFirstName,
      user.lastName AS instructorLastName,
      COALESCE(AVG(submission.grade), 0) AS averageGrade
    FROM course
    JOIN instructor ON course.instructorID = instructor.userID
    JOIN user ON instructor.userID = user.userID
    LEFT JOIN assignment ON course.courseID = assignment.courseID
    LEFT JOIN submission ON assignment.assignmentID = submission.assignmentID
    WHERE course.isArchived = ?
    GROUP BY course.courseID, user.userID
  `;
  try {
    const rows = await query(sql, [isArchived], customPool);
    return rows.map((row: any) => ({
      ...row,
      averageGrade: row.averageGrade !== null ? parseFloat(row.averageGrade) : null,
    }));
  } catch (error) {
    console.error('Error in getAllCourses:', error); // Log the error
    throw error;
  }
}

export async function addAssignmentToDatabase(
  title: string, 
  description: string, 
  dueDate: string, 
  file: string, 
  groupAssignment: boolean, 
  courseID: number,
  allowedFileTypes: string[],
  customPool?: mysql.Pool
) {
  if (!Number.isInteger(courseID)) {
    throw new Error('Invalid courseID');
  }
  const allowedFileTypesString = allowedFileTypes.join(',');
  const sql = `
    INSERT INTO assignment (title, description, deadline, rubric, groupAssignment, courseID, allowedFileTypes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    // Check if the classID exists in the class table
    const classCheckSql = 'SELECT COUNT(*) as count FROM course WHERE courseID = ?';
    const classCheckResult = await query(classCheckSql, [courseID], customPool);

    if (!classCheckResult || !Array.isArray(classCheckResult) || classCheckResult.length === 0) {
      throw new Error(`Unexpected result when checking for class with ID ${courseID}`);
    }

    const count = classCheckResult[0].count;

    if (count === 0) {
      throw new Error(`No class found with ID ${courseID}`);
    }

    // If the class exists, proceed with the insert
    const insertResult = await query(sql, [title, description, new Date(dueDate), file, groupAssignment, courseID, allowedFileTypesString], customPool);

    return insertResult;
  } catch (error: any) {
    console.error('Error in addAssignmentToDatabase:', error);
    throw error;
  }
}

export async function getAssignments(customPool?: mysql.Pool): Promise<any[]> {
  const sql = 'SELECT assignmentID, title, description, DATE_FORMAT(deadline, "%Y-%m-%dT%H:%i:%s.000Z") as deadline FROM assignment';
  try {
    const rows = await query(sql, [], customPool);
    console.log('Fetched assignments:', rows);
    return rows as any[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getCourses(): Promise<any[]> {
  const sql = 'SELECT * FROM course';
  try {
    const rows = await query(sql);
    return rows as any[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}


// export async function submitAssignment(assignmentID: number, studentID: number, file: Buffer) {
//   const sql = `
//     INSERT INTO submissions (assignmentID, studentID, submissionDate, file)
//     VALUES (?, ?, NOW(), ?)
//   `;
//   try {
//     await query(sql, [assignmentID, studentID, file]);
//   } catch (error) {
//     console.error('Error in submitAssignment:', error);
//     throw error;
//   }
// }

export async function getAssignmentsWithSubmissions() {
  const sql = `
    SELECT 
      a.assignmentID, 
      a.title, 
      a.description, 
      DATE_FORMAT(a.deadline, '%Y-%m-%dT%H:%i:%s.000Z') as deadline,
      a.rubric,
      a.file,
      s.studentID,
      DATE_FORMAT(s.submissionDate, '%Y-%m-%dT%H:%i:%s.000Z') as submissionDate,
      s.file as submissionFile
    FROM 
      assignment a
    LEFT JOIN 
      submissions s ON a.assignmentID = s.assignmentID
  `;
  try {
    const rows = await query(sql);
    
    // Group submissions by assignment
    const assignments = rows.reduce((acc: any[], row: any) => {
      const assignment = acc.find((a: { assignmentID: any; }) => a.assignmentID === row.assignmentID);
      if (assignment) {
        if (row.studentID) {
          assignment.submissions.push({
            studentID: row.studentID,
            submissionDate: row.submissionDate,
            file: row.submissionFile
          });
        }
      } else {
        acc.push({
          assignmentID: row.assignmentID,
          title: row.title,
          description: row.description,
          deadline: row.deadline,
          rubric: row.rubric,
          file: row.file,
          submissions: row.studentID ? [{
            studentID: row.studentID,
            submissionDate: row.submissionDate,
            file: row.submissionFile
          }] : []
        });
      }
      return acc;
    }, []);

    return assignments;
  } catch (error) {
    console.error('Error in getAssignmentsWithSubmissions:', error);
  }
}


export async function getCoursesByStudentID(studentID: number): Promise<any[]> {
  const sql = `SELECT c.courseID, c.courseName, u.firstName AS instructorFirstName
FROM enrollment e
JOIN course c ON e.courseID = c.courseID
JOIN instructor i ON c.instructorID = i.userID
JOIN user u ON i.userID = u.userID
WHERE e.studentID = ?
ORDER BY c.courseID`;
  try {
    console.log('Fetching courses for student:', studentID);
    const rows = await query(sql, [studentID]);
    return rows;
  } catch (error) {
    console.error('Error fetching courses for student:', error);
    throw error;
  }
}

export async function createCourse(courseName: string, instructorID: number, customPool?: mysql.Pool) {
  const sql = `
    INSERT INTO course (courseName, isArchived, instructorID)
    VALUES (?, false, ?)
  `;
  try {
    const result = await query(sql, [courseName, instructorID], customPool);
    return result.insertId; // Return the inserted course ID
  } catch (error) {
    console.error('Error in createCourse:', error); // Log the error
    throw error;
  }
}

export async function getAssignmentForStudentView(assignmentId: number, customPool?: mysql.Pool) {
  const sql = `
    SELECT 
      assignmentID, 
      title, 
      description, 
      DATE_FORMAT(deadline, '%Y-%m-%dT%H:%i:%s.000Z') as deadline,
      rubric,
      groupAssignment,
      courseID,
      allowedFileTypes
    FROM assignment 
    WHERE assignmentID = ?
  `;
  try {
    const rows = await query(sql, [assignmentId], customPool);
    if (rows.length === 0) {
      return null;
    }
    const assignment = rows[0];
    assignment.allowedFileTypes = assignment.allowedFileTypes ? assignment.allowedFileTypes.split(',') : [];
    return assignment;
  } catch (error) {
    console.error('Error in getAssignmentForStudentView:', error);
    throw error;
  }
}

export async function submitAssignment(assignmentID: number, studentID: number, file: Express.Multer.File) {
  const sql = `
    INSERT INTO submission (assignmentID, studentID, fileName, fileContent, fileType, submissionDate)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  try {
    const fileContent = await fs.readFile(file.path);
    const fileName = file.originalname;
    const fileType = file.mimetype;

    await query(sql, [assignmentID, studentID, fileName, fileContent, fileType]);

    // Delete the temporary file after it's been saved to the database
    await fs.unlink(file.path);

    return { success: true, message: 'Assignment submitted successfully' };
  } catch (error) {
    console.error('Error in submitAssignment:', error);
    throw error;
  }
}

export async function getSubmissionFile(submissionID: number) {
  const sql = `
    SELECT fileName, fileContent, fileType
    FROM submission
    WHERE submissionID = ?
  `;

  try {
    const rows = await query(sql, [submissionID]);
    if (rows.length === 0) {
      throw new Error('Submission not found');
    }

    const { fileName, fileContent, fileType } = rows[0];
    return { fileName, fileContent, fileType };
  } catch (error) {
    console.error('Error in getSubmissionFile:', error);
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
export async function enrollStudent(userID: string, courseID: string, customPool?: mysql.Pool): Promise<void> {
  const sql = `
    INSERT INTO enrollment (studentID, courseID)
    VALUES (?, ?)
  `;
  try {
    const result = await query(sql, [userID, courseID], customPool);
  } catch (error) {
    const err = error as Error;
    console.error(`Error enrolling student ${userID} in course ${courseID}:`, err.message);
    throw err;
  }
}
