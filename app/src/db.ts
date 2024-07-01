// db.ts
import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db', // Replace this if running on localhost, else if running on docker container, use 'db'
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'SprintRunners', // SprintRunners
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
export async function addAssignmentToDatabase(
  title: string, 
  description: string, 
  dueDate: string, 
  file: string, 
  groupAssignment: boolean, 
  courseID: number,
  allowedFileTypes: string[]
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
    const classCheckResult = await query(classCheckSql, [courseID]);
    
    console.log('Class check result:', classCheckResult);

    if (!classCheckResult || !Array.isArray(classCheckResult) || classCheckResult.length === 0) {
      throw new Error(`Unexpected result when checking for class with ID ${courseID}`);
    }

    const count = classCheckResult[0].count;

    if (count === 0) {
      throw new Error(`No class found with ID ${courseID}`);
    }

    // If the class exists, proceed with the insert
    const insertResult = await query(sql, [title, description, new Date(dueDate), file, groupAssignment, courseID, allowedFileTypesString]);
    console.log('Insert result:', insertResult);

    return insertResult;
  } catch (error: any) {
    console.error('Error in addAssignmentToDatabase:', error);
    throw error;
  }
}


export async function getAssignments(): Promise<any[]> {
  const sql = `
    SELECT assignmentID, title
    FROM assignment
    ORDER BY title ASC
  `;

  try {
    const rows = await query(sql);
    return rows as any[];
  } catch (error) {
    console.error('Error fetching assignments:', error);
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
    const assignments = rows.reduce((acc, row) => {
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
    throw error;
  }
}

export async function getAssignmentForStudentView(assignmentId: number) {
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
    const rows = await query(sql, [assignmentId]);
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

// export async function submitAssignment(assignmentID: number, studentID: number, file: Express.Multer.File) {
//   const sql = `
//     INSERT INTO submission (assignmentID, studentID, fileName, fileContent, fileType, submissionDate)
//     VALUES (?, ?, ?, ?, ?, NOW())
//   `;

//   try {
//     const fileContent = await fs.readFile(file.path);
//     const fileName = file.originalname;
//     const fileType = file.mimetype;

//     await query(sql, [assignmentID, studentID, fileName, fileContent, fileType]);

//     // Delete the temporary file after it's been saved to the database
//     await fs.unlink(file.path);

//     return { success: true, message: 'Assignment submitted successfully' };
//   } catch (error) {
//     console.error('Error in submitAssignment:', error);
//     throw error;
//   }
// }

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
// Added these new functions for the peer review form for instrcutor

export async function addReviewCriteria(assignmentID: number, criteria: { criterion: string; maxMarks: number }[]) {
  const sql = `
    INSERT INTO review_criteria (assignmentID, criterion, maxMarks)
    VALUES (?, ?, ?)
  `;

  try {
    for (const item of criteria) {
      await query(sql, [assignmentID, item.criterion, item.maxMarks]);
    }
  } catch (error) {
    console.error('Error adding review criteria:', error);
    throw error;
  }
}

export async function getReviewCriteria(assignmentID: number) {
  const sql = `
    SELECT criteriaID, criterion, maxMarks
    FROM review_criteria
    WHERE assignmentID = ?
  `;

  try {
    const rows = await query(sql, [assignmentID]);
    return rows;
  } catch (error) {
    console.error('Error getting review criteria:', error);
    throw error;
  }
}

export async function updateAssignment(
  assignmentID: number,
  isGroupAssignment: boolean,
  allowedFileTypes: string,
  deadline: Date
) {
  const sql = `
    UPDATE assignment
    SET groupAssignment = ?, allowedFileTypes = ?, deadline = ?
    WHERE assignmentID = ?
  `;

  try {
    await query(sql, [isGroupAssignment, allowedFileTypes, deadline, assignmentID]);
  } catch (error) {
    console.error('Error updating assignment:', error);
    throw error;
  }
}

export async function setUniqueDueDates(assignmentID: number, studentIDs: number[], dueDate: string) {
  try {
    const connection = await pool.getConnection();

    for (const studentID of studentIDs) {
      await connection.execute(
        'INSERT INTO unique_due_dates (assignmentID, studentID, uniqueDeadline) VALUES (?, ?, ?) ' +
        'ON DUPLICATE KEY UPDATE uniqueDeadline = ?',
        [assignmentID, studentID, dueDate, dueDate]
      );
    }

    connection.release();
    return { message: 'Unique due dates set successfully' };
  } catch (error) {
    console.error('Error setting unique due dates:', error);
    throw error;
  }
}


//Get students for setting unique due date
export async function getStudents(): Promise<any[]> {
  const sql = `
    SELECT u.userID, u.firstName, u.lastName, u.email, s.studentID
    FROM user u
    JOIN student s ON u.userID = s.userID
    WHERE u.userRole = 'student'
    ORDER BY u.lastName, u.firstName
  `;

  try {
    const rows = await query(sql);
    return rows;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}