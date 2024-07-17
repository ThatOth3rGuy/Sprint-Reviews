// pages/api/submitAssignment.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer';
import { submitAssignment } from '../../../db'; 

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ dest: '/tmp' });

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
    const { assignmentID, studentID } = req.body;

    try {
      const result = await submitAssignment(parseInt(assignmentID), parseInt(studentID), file);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      res.status(500).json({ message: 'Error submitting assignment' });
    }
  });
}