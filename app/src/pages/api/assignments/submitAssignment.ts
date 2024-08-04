// pages/api/assignments/submitAssignment.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.error('Method not allowed');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ success: false, message: 'Error processing request' });
    }

    try {
      const assignmentID = fields.assignmentID;
      const userID = fields.userID;
      const link = fields.link;

      if (!assignmentID || !userID) {
        console.error('Missing required fields:', { assignmentID, userID });
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      if (files.file) {
        // Handle file submission
        const file = files.file[0];
        const fileContent = await fs.readFile(file.filepath);
        const fileName = file.originalFilename || 'unnamed_file';
        const fileType = file.mimetype || 'application/octet-stream';

        const result = await submitAssignment(Number(assignmentID), Number(userID), fileName, fileContent, fileType);

        // Delete the temporary file after it's been saved to the database
        await fs.unlink(file.filepath);

        console.log('File submitted successfully');
        return res.status(200).json(result);
      } else if (link) {
        // Handle link submission
        const result = await submitAssignment(Number(assignmentID), Number(userID), link, link, 'link');
        console.log('Link submitted successfully');
        return res.status(200).json(result);
      } else {
        console.error('No file or link provided');
        return res.status(400).json({ success: false, message: 'No file or link provided' });
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      return res.status(500).json({ success: false, message: 'Error submitting assignment' });
    }
  });
}

async function submitAssignment(assignmentID: number, userID: number, fileName: string, fileContent: Buffer | string, fileType: string) {
  const studentIdSQL = `SELECT studentID FROM student WHERE userID = ?`;
  const checkExistingSQL = `SELECT submissionID FROM submission WHERE assignmentID = ? AND studentID = ?`;
  const insertSQL = `
    INSERT INTO submission (assignmentID, studentID, fileName, fileContent, fileType, submissionDate)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  const updateSQL = `
    UPDATE submission
    SET fileName = ?, fileContent = ?, fileType = ?, submissionDate = NOW()
    WHERE submissionID = ?
  `;

  try {
    // Convert userID to studentID
    const studentIDResult = await query(studentIdSQL, [userID]);
    if (!studentIDResult || studentIDResult.length === 0) {
      throw new Error('User not found');
    }
    const studentID = studentIDResult[0].studentID;

    // Check if a submission already exists
    const existingSubmission = await query(checkExistingSQL, [assignmentID, studentID]);

    if (existingSubmission && existingSubmission.length > 0) {
      // Update existing submission
      await query(updateSQL, [fileName, fileContent, fileType, existingSubmission[0].submissionID]);
      return { success: true, message: 'Assignment resubmitted successfully' };
    } else {
      // Insert new submission
      await query(insertSQL, [assignmentID, studentID, fileName, fileContent, fileType]);
      return { success: true, message: 'Assignment submitted successfully' };
    }
  } catch (error) {
    console.error('Error in submitAssignment:', error);
    throw error;
  }
}