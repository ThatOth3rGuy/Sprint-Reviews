import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import config from './dbConfig'; // Import the database configuration from dbConfig.ts

let dbConfig;

if (process.env.NODE_ENV === 'production') {
  dbConfig = config.production;
} else if (process.env.NODE_ENV === 'development' && process.env.DEV_DB_HOST === '') {
  dbConfig = config.development;
} else if (process.env.NODE_ENV === 'development' && process.env.DEV_DB_HOST === 'db') {
  dbConfig = config.localhost;
} else {
  dbConfig = config.testing;
}

// Use the production configuration if the NODE_ENV environment variable is set to 'production' but development config by default
const pool = mysql.createPool(dbConfig);

// main function to query the database with the given SQL query and values from pool
export async function query(sql: string, values: any[] = [], customPool: mysql.Pool = pool): Promise<any> {
  try {
    const [result] = await customPool.execute(sql, values);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
// function to add a user to the database
export async function createUser(firstName: string, lastName: string, email: string, password: string, role: string) {
  const sql = `
    INSERT INTO user (firstName, lastName, email, pwd, userRole)
    VALUES (?, ?, ?, ?, ?)
  `;
  try {
    const result = await query(sql, [firstName, lastName, email, password, role]);
    return result.insertId; // Return the inserted user ID for adding to the instructor or student table
  } catch (error) {
    console.error('Error in addUser:', error); // Log the error
    throw error;
  }
}
export async function getInstructorIDFromUserID(userID: number): Promise<number> {
  const sql = `
    SELECT instructorID
    FROM instructor
    WHERE userID = ?
  `;
  try {
    const result = await query(sql, [userID]);
    if (result.length > 0) {
      return result[0].instructorID;
    } else {
      throw new Error('No instructor found with the provided userID');
    }
  } catch (error) {
    console.error('Error in getInstructorIDFromUserID:', error);
    throw error;
  }
}
// function to add an instructor to the database if the userRole is instructor
export async function createInstructor(instructorID: number, userID: number, isAdmin: boolean) {
  const sql = `
    INSERT INTO instructor (instructorID, userID, isAdmin)
    VALUES (?, ?, ?)
  `;
  try {
    await query(sql, [instructorID, userID, isAdmin]);
  } catch (error) {
    console.error('Error in addInstructor:', error); // Log the error
    throw error;
  }
}
// function to add a student to the database if the userRole is student
export async function createStudent(studentID: number, userID: number) {
  const sql = `
    INSERT INTO student (studentID, userID)
    VALUES (?, ?)
  `;
  try {
    await query(sql, [studentID, userID]);
  } catch (error) {
    console.error('Error in addStudent:', error); // Log the error
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
export async function getInstructorID(userID: number): Promise<number | null> {
  if (typeof userID !== 'number' || isNaN(userID)) {
    throw new Error(`Invalid userID: ${userID}`);
  }
  const sql = 'SELECT instructorID FROM instructor WHERE userID = ?';
  try {
    const rows = await query(sql, [userID]);
    if (rows.length === 0) {
      return null; // No instructor found for this userID
    }
    return rows[0].instructorID;
  } catch (error) {
    console.error('Database query error:', error);
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
    JOIN instructor ON course.instructorID = instructor.instructorID
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
export async function addAssignmentToCourse(
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
    INSERT INTO assignment (title, descr, deadline, rubric, groupAssignment, courseID, allowedFileTypes)
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
export async function getAllAssignmentsStudent(userID: number) {
  const sql = `
    SELECT a.*
FROM assignment a
JOIN course c ON a.courseID = c.courseID
JOIN enrollment e ON c.courseID = e.courseID
JOIN student s ON e.studentID = s.studentID
JOIN user u ON s.userID = u.userID
WHERE u.userID = ?;
  `;
  try {
    const results = await query(sql, [userID]);
    return results;
  } catch (error) {
    console.error('Error in getAllAssignments:', error);
    throw error;
  }
}
export async function getAllAssignmentsInstructor(userID: number) {
  const sql = `
    SELECT a.*
FROM assignment a
JOIN course c ON a.courseID = c.courseID
JOIN instructor i ON c.instructorID = i.instructorID
JOIN user u ON i.userID = u.userID
WHERE u.userID = ?`;

  try {
    const results = await query(sql, [userID]);
    return results;
  } catch (error) {
    console.error('Error in getAllAssignments:', error);
    throw error;
  }
}
export async function getAssignments(customPool?: mysql.Pool): Promise<any[]> {
  const sql = 'SELECT assignmentID, title, descr, DATE_FORMAT(deadline, "%Y-%m-%dT%H:%i:%s.000Z") as deadline FROM assignment';
  try {
    const rows = await query(sql, [], customPool);
    console.log('Fetched assignments:', rows);
    return rows as any[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getCourses(customPool?: mysql.Pool): Promise<any[]> {
  const sql = 'SELECT * FROM course';
  try {
    const rows = await query(sql, [], customPool);
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

export async function getAssignmentsWithSubmissions(customPool?: mysql.Pool) {
  const sql = `
    SELECT 
      a.assignmentID, 
      a.title, 
      a.descr as description, 
      DATE_FORMAT(a.deadline, '%Y-%m-%dT%H:%i:%s.000Z') as deadline,
      a.rubric,
      a.allowedFileTypes,
      s.studentID,
      DATE_FORMAT(s.submissionDate, '%Y-%m-%dT%H:%i:%s.000Z') as submissionDate,
      s.fileName as submissionFile
    FROM 
      assignment a
    LEFT JOIN 
      submission s ON a.assignmentID = s.assignmentID
  `;
  try {
    const rows = await query(sql, [], customPool);
    
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
          allowedFileTypes: row.allowedFileTypes ? row.allowedFileTypes.split(',') : [],
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


export async function getCoursesByStudentID(studentID: number, customPool?: mysql.Pool): Promise<any[]> {
  const sql = `SELECT c.courseID, c.courseName, u.firstName AS instructorFirstName
FROM enrollment e
JOIN course c ON e.courseID = c.courseID
JOIN instructor i ON c.instructorID = i.instructorID
JOIN user u ON i.userID = u.userID
WHERE e.studentID = ?
ORDER BY c.courseID`;
  try {
    const rows = await query(sql, [studentID], customPool);
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
      descr, 
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

export async function submitAssignment(assignmentID: number, studentID: number, file: Express.Multer.File, customPool?: mysql.Pool) {
  const sql = `
    INSERT INTO submission (assignmentID, studentID, fileName, fileContent, fileType, submissionDate)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  try {
    const fileContent = await fs.readFile(file.path);
    const fileName = file.originalname;
    const fileType = file.mimetype;

    await query(sql, [assignmentID, studentID, fileName, fileContent, fileType], customPool);

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

// Added these new functions for the peer review form for instrcutor

// export async function addReviewCriteria(assignmentID: number, criteria: { criterion: string; maxMarks: number }[]) {
//   const sql = `
//     INSERT INTO review_criteria (assignmentID, criterion, maxMarks)
//     VALUES (?, ?, ?)
//   `;

//   try {
//     for (const item of criteria) {
//       await query(sql, [assignmentID, item.criterion, item.maxMarks]);
//     }
//   } catch (error) {
//     console.error('Error adding review criteria:', error);
//     throw error;
//   }
// }
export async function createReview(
  assignmentID: number, 
  isGroupAssignment: boolean, 
  allowedFileTypes: string, 
  deadline: Date
): Promise<void> {
  const result = await query(
    'INSERT INTO review (assignmentID, isGroupAssignment, allowedFileTypes, deadline) VALUES (?, ?, ?, ?)',
    [assignmentID, isGroupAssignment, allowedFileTypes, deadline]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Failed to create review');
  }
}

export async function addReviewCriteria(assignmentID: number, rubric: { criterion: string; maxMarks: number }[]): Promise<void> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    for (const item of rubric) {
      await query(
        'INSERT INTO review_criteria (assignmentID, criterion, maxMarks) VALUES (?, ?, ?)',
        [assignmentID, item.criterion, item.maxMarks]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
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

// export async function setUniqueDueDates(assignmentID: number, studentIDs: number[], dueDate: string) {
//   try {
//     const connection = await pool.getConnection();

//     for (const studentID of studentIDs) {
//       await connection.execute(
//         'INSERT INTO unique_due_dates (assignmentID, studentID, uniqueDeadline) VALUES (?, ?, ?) ' +
//         'ON DUPLICATE KEY UPDATE uniqueDeadline = ?',
//         [assignmentID, studentID, dueDate, dueDate]
//       );
//     }

//     connection.release();
//     return { message: 'Unique due dates set successfully' };
//   } catch (error) {
//     console.error('Error setting unique due dates:', error);
//     throw error;
//   }
// }

export async function selectStudentsForAssignment(assignmentID: number, studentIDs: string[], uniqueDeadline: string | null): Promise<void> {
  const sql = `
    INSERT INTO selected_students (assignmentID, studentID, uniqueDeadline)
    VALUES (?, ?, ?)
  `;

  try {
    for (const studentID of studentIDs) {
      await query(sql, [assignmentID, Number(studentID), uniqueDeadline]);
    }
  } catch (error) {
    const err = error as Error;
    console.error(`Error selecting students for assignment:`, err.message);
  }
}
export async function getCourse(courseID: number): Promise<any> {
  const sql = `
    SELECT courseID, courseName  FROM course WHERE instructorID = ?  `;
  try {
    const rows = await query(sql, [courseID]);
    return rows[0];
  } catch (error) {
    console.error('Error in getCourse:', error);
    throw error;
  }
}
  // grab all students from the database matching the first and last name
  export async function getStudentsByName(firstName:string, lastName:string) {
    const sql = `
      SELECT user.*, student.studentID FROM user JOIN student ON user.userID = student.userID WHERE user.firstName = ? AND user.lastName = ? AND user.userRole = 'student'
    `;
    try {
      const rows = await query(sql, [firstName, lastName]);
      if (rows.length > 0) {
        return rows[0];
      } else {
        return null; // Return null if no student is found
      }
    } catch (error) {
      console.error('Error in getStudents:', error);
      throw error;
    }
  }
    // grab all students from the database matching their student ID's
    export async function getStudentsById(userID: number, customPool: mysql.Pool = pool) {
      const sql = `
        SELECT studentID, u.userID FROM student s JOIN user u ON s.userID = u.userID WHERE u.userID = ?
      `;
      try {
        const rows = await query(sql, [userID], customPool);
        if (rows.length > 0) {
          return rows[0];
        } else {
          return null; // Return null if no student is found
        }
      } catch (error) {
        console.error('Error in getStudents:', error);
        throw error;
      }
    }
//  enroll student in a course
export async function enrollStudent(userID: string, courseID: string, customPool: mysql.Pool = pool): Promise<void> {
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

export async function getStudentsInCourse(courseID: number, customPool?: mysql.Pool): Promise<any[]> {
  const sql = `
    SELECT u.userID, u.firstName, u.lastName, u.email, s.studentID
    FROM user u
    JOIN student s ON u.userID = s.userID
    JOIN enrollment e ON s.studentID = e.studentID
    WHERE u.userRole = 'student' AND e.courseID = ?
    ORDER BY u.lastName, u.firstName
  `;

  try {
    const rows = await query(sql, [courseID], customPool);
    return rows;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}
// Inserts a student into the selected_students table for the defined submission in a course.
export async function selectStudentForSubmission(studentID: number, assignmentID: number, courseID: number, submissionID: number): Promise<void> {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS student_groups (
      studentID INT,
      assignmentID INT,
      courseID INT,
      submissionID INT,
      PRIMARY KEY (studentID, submissionID),
      FOREIGN KEY (studentID) REFERENCES student(studentID),
      FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID),
      FOREIGN KEY (courseID) REFERENCES course(courseID),
      FOREIGN KEY (submissionID) REFERENCES submission(submissionID)
    )
  `;

  const insertSql = `
    INSERT INTO student_groups (studentID, assignmentID, courseID, submissionID)
    VALUES (?, ?, ?, ?)
  `;

  try {
    await query(createTableSql);
    await query(insertSql, [studentID, assignmentID, courseID, submissionID]);
  } catch (error) {
    const err = error as Error;
    console.error(`Error selecting student ${studentID} for assignment ${assignmentID}:`, err.message);
    throw err;
  }
}
// Updates the assignment for a student to review with given submissionID
export async function updateReviewer(studentID: number, assignmentID: number, submissionID: number): Promise<void> {
  // Assuming getReviewGroups is imported or available in this context
  // and it returns an array of existing records based on the provided parameters

  // Update SQL template
  const updateSql = `
    UPDATE student_groups
    SET ${assignmentID ? 'assignmentID = ?' : ''}${assignmentID && submissionID ? ', ' : ''}${submissionID ? 'submissionID = ?' : ''}
    WHERE studentID = ?
  `;

  // Parameters for the update query
  const updateParams = [...(assignmentID ? [assignmentID] : []), ...(submissionID ? [submissionID] : []), studentID];

  try {
    // Use getReviewGroups to check if the record exists
    const existingRecords = await getReviewGroups(studentID, assignmentID, submissionID);
    if (existingRecords.length > 0) {
      console.log(`The studentID ${studentID} with assignmentID ${assignmentID} or submissionID ${submissionID} already exists.`);
      return; // Skip update if exists
    }

    // Proceed with update if not exists
    await query(updateSql, updateParams);
    console.log(`Updated studentID ${studentID} with new assignmentID ${assignmentID} or new submissionID ${submissionID}.`);
  } catch (error) {
    const err = error as Error;
    console.error(`Error updating student ${studentID}:`, err.message);
    throw err;
  }
}
// Get review groups for a student based on the provided parameters
export async function getReviewGroups(studentID?: number, assignmentID?: number, submissionID?: number, groupBy?: string) {
  const sql = `
    SELECT *
    FROM student_groups
    WHERE ${studentID ? 'studentID = ?' : ''}${studentID && (assignmentID || submissionID) ? ' AND ' : ''}${assignmentID ? 'assignmentID = ?' : ''}${assignmentID && submissionID ? ' AND ' : ''}${submissionID ? 'submissionID = ?' : ''}
    ${groupBy ? `GROUP BY ${groupBy}` : ''}
  `;

  try {
    const params = [studentID, assignmentID, submissionID].filter(value => value !== undefined);
    const rows = await query(sql, params);
    return rows;
  } catch (error) {
    console.error('Error fetching review groups:', error);
    throw error;
  }
}
//Get students for setting unique due date
// export async function getStudents(): Promise<any[]> {
//   const sql = `
//     SELECT u.userID, u.firstName, u.lastName, u.email, s.studentID
//     FROM user u
//     JOIN student s ON u.userID = s.userID
//     WHERE u.userRole = 'student'
//     ORDER BY u.lastName, u.firstName
//   `;

//   try {
//     const rows = await query(sql);
//     return rows;
//   } catch (error) {
//     console.error('Error fetching students:', error);
//     throw error;
//   }
// }
// export async function getStudents(userId: string) {
//   const sql = `
//     SELECT * FROM student WHERE userID = ?
//   `;
//   try {
//     const rows = await query(sql, [userId]);
//     if (rows.length > 0) {
//       return rows[0];
//     }
//   } catch (error) {
//     console.error('Error in getStudents:', error);
//     throw error;
//   }
// }
// export async function assignStudent(userID: string, assignmentID: string): Promise<void> {
//   const sql = `
//     UPDATE assignment SET studentID = ? WHERE assignmentID = ?
//   `;
//   try {
//     const result = await query(sql, [userID, assignmentID]);
//   } catch (error) {
//     const err = error as Error;
//     console.error(`Error adding student ${userID} to assignment ${assignmentID}:`, err.message);
//     throw err;
//   }
// }
