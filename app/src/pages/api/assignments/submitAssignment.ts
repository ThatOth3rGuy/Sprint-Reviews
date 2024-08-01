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

async function submitAssignment(assignmentID: number, userID: number, file: Express.Multer.File | null, link: string | null) {
  const studentIdSQL = `SELECT studentID FROM student WHERE userID = ?`;
  const sql = `
    INSERT INTO submission (assignmentID, studentID, fileName, fileContent, fileType, submissionDate)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  try {
    // Convert userID to studentID
    const studentIDResult = await query(studentIdSQL, [userID]);
    const studentID = parseInt(studentIDResult[0].studentID);

    let fileName, fileContent, fileType;

    if (file) {
      // Handle file submission
      fileContent = await fs.readFile(file.path);
      fileName = file.originalname;
      fileType = file.mimetype;

      // Delete the temporary file after it's been saved to the database
      await fs.unlink(file.path);
    } else if (link) {
      // Handle link submission
      fileName = link;
      fileContent = null;
      fileType = 'link';
    } else {
      throw new Error('No file or link provided');
    }

    await query(sql, [assignmentID, studentID, fileName, fileContent, fileType]);

    return { success: true, message: 'Assignment submitted successfully' };
  } catch (error) {
    console.error('Error in submitAssignment:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const contentType = req.headers['content-type'];

  if (contentType && contentType.includes('multipart/form-data')) {
    // Handle file submission
    const multerMiddleware = upload.single('file');

    multerMiddleware(req as any, res as any, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading file' });
      }

      const file = (req as any).file;
      const { assignmentID, userID } = req.body;

      try {
        const result = await submitAssignment(parseInt(assignmentID), parseInt(userID), file, null);
        res.status(200).json(result);
      } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({ message: 'Error submitting assignment' });
      }
    });
  } else {
    // Handle link submission
    const { assignmentID, userID, link } = req.body;

    try {
      const result = await submitAssignment(Number(assignmentID), Number(userID), null, link);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      res.status(500).json({ message: 'Error submitting assignment' });
    }
  }
}