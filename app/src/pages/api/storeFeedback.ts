import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { assignmentID, studentID, content } = req.body;

    if (!assignmentID || !studentID || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const sql = `
        INSERT INTO feedback (assignmentID, otherStudentID, content)
        VALUES (?, ?, ?)
      `;
      await query(sql, [assignmentID, studentID, content]);
      res.status(200).json({ message: 'Feedback stored successfully' });
    } catch (error) {
      console.error('Error storing feedback:', error);
      res.status(500).json({ message: 'Error storing feedback' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}