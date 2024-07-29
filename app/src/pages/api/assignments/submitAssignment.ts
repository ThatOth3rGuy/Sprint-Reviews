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
    const { assignmentID, studentID, courseID, isGroupAssignment, groupID } = req.body;

    try {
      const studentIDList = isGroupAssignment ? JSON.parse(groupID) : [studentID];

      const results = await Promise.all(
        studentIDList.map((studentID: number) => submitAssignment(parseInt(assignmentID), studentID, file, isGroupAssignment ? parseInt(groupID) : null))
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
