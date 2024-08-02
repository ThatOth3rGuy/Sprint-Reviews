// pages/api/assignments/submitAssignment.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs/promises';
import { query, getStudentsById } from '../../../db';

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
    let { assignmentID, userID, isGroupAssignment, groupID, students } = req.body;

    try {
      // Parse students if it is a string (assuming it comes as a JSON string)
      if (typeof students === 'string') {
        students = JSON.parse(students);
      }

      console.log('userID:', userID);

      // Convert userID to studentID
      const studentIDResult = await getStudentsById(parseInt(userID));
      const studentID = studentIDResult.studentID;

      console.log('studentID:', studentID);

      // Set studentIDList to either the studentID or the list of student IDs in the group
      const studentIDList = [studentID];
      if (isGroupAssignment === '1' && Array.isArray(students)) {
        studentIDList.push(...students.map((id: string) => parseInt(id)));
      }

      const results = await Promise.all(
        studentIDList.map((id) => submitAssignment(parseInt(assignmentID), id, file, isGroupAssignment === '1' ? parseInt(groupID) : null))
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
