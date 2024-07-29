// pages/api/assignments/submitAssignment.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer';
import fs from 'fs/promises';
import { query } from '../../../db';
import { get } from 'http';

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

    // Delete the temporary file after it's been saved to the database
    await fs.unlink(file.path);

    return { success: true, message: 'Assignment submitted successfully' };
  } catch (error) {
    console.error('Error in submitAssignment:', error);
    throw error;
  }
}

async function getGroupID(courseID: number, studentID: number) {
  console.log('courseID:', courseID);
  console.log('studentID:', studentID);
  
  const sql = `
    SELECT groupID
    FROM course_groups
    WHERE courseID = ? AND studentID = ?
  `;

  try {
    const result = await query(sql, [courseID, studentID]);
    return result[0].groupID;
  } catch (error) {
    console.error('Error in getGroupID:', error);
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

      // get isGroupAssignment from assignment table
      const isGroupAssignment = await getIsGroupAssignment(assignmentID);

      // Get groupID if the assignment is a group assignment
      let groupID = null;
      if (isGroupAssignment == 1) {
        groupID = await getGroupID(parseInt(courseID), studentIDResult[0].studentID);
      }

      // Submit the assignment
      const result = await submitAssignment(parseInt(assignmentID), studentIDResult[0].studentID, file, groupID);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      res.status(500).json({ message: 'Error submitting assignment' });
    }
  });
}