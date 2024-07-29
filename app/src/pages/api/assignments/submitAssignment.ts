// pages/api/assignments/submitAssignment.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs/promises';
import { query } from '../../../db';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ dest: '/tmp' });

async function submitAssignment(assignmentID: number, studentID: number, file: Express.Multer.File, groupID?: number | null) {
  const sql = `
    INSERT INTO submission (assignmentID, studentID, fileName, fileContent, fileType, submissionDate, groupID)
    VALUES (?, ?, ?, ?, ?, NOW(), ?)
  `;

  try {
    const fileContent = await fs.readFile(file.path);
    const fileName = file.originalname;
    const fileType = file.mimetype;

    await query(sql, [assignmentID, studentID, fileName, fileContent, fileType, groupID]);

    return { success: true, message: 'Assignment submitted successfully' };
  } catch (error) {
    console.error('Error in submitAssignment:', error);
    throw error;
  }
}

async function getGroupDetails(courseID: number, studentID: number) {
  const sql = `
    SELECT groupID
    FROM course_groups
    WHERE courseID = ? AND studentID = ?
  `;

  try {
    const result = await query(sql, [courseID, studentID]);
    const groupID = result[0].groupID;

    const studentSQL = `
      SELECT studentID
      FROM course_groups
      WHERE courseID = ? AND groupID = ?
    `;

    const studentResults = await query(studentSQL, [courseID, groupID]);
    const studentIDs = studentResults.map((row: any) => row.studentID);

    return { groupID, studentIDs };
  } catch (error) {
    console.error('Error in getGroupDetails:', error);
    throw error;
  }
}

async function getIsGroupAssignment(assignmentID: number) {
  const sql = `
    SELECT groupAssignment
    FROM assignment
    WHERE assignmentID = ?
  `;

  try {
    const result = await query(sql, [assignmentID]);
    return result[0].groupAssignment;
  } catch (error) {
    console.error('Error in getIsGroupAssignment:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const multerMiddleware = upload.single('file');

  multerMiddleware(req as any, res as any, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file' });
    }

    const file = (req as any).file;
    const { assignmentID, studentID, courseID } = req.body;

    try {
      // Convert userID to studentID
      const studentIdSQL = `SELECT studentID FROM student WHERE userID = ?`;
      const studentIDResult = await query(studentIdSQL, [studentID]);
      const actualStudentID = studentIDResult[0].studentID;

      // get isGroupAssignment from assignment table
      const isGroupAssignment = await getIsGroupAssignment(assignmentID);

      // Initialize groupID and studentIDs
      let groupID = null;
      let studentIDs = [actualStudentID];

      if (isGroupAssignment == 1) {
        const groupDetails = await getGroupDetails(parseInt(courseID), actualStudentID);
        groupID = groupDetails.groupID;
        studentIDs = groupDetails.studentIDs;
      }

      // Submit the assignment for each student in the group or individually
      const results = await Promise.all(
        studentIDs.map(studentID => submitAssignment(parseInt(assignmentID), studentID, file, groupID))
      );

      // Delete the temporary file after all submissions are complete
      await fs.unlink(file.path);

      res.status(200).json({ success: true, message: 'Assignment submitted successfully', results });
    } catch (error) {
      console.error('Error submitting assignment:', error);
      res.status(500).json({ message: 'Error submitting assignment' });
    }
  });
}
