// /pages/api/updateCourseName.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { courseID, newCourseName } = req.body;

    try {
      const updateSql = 'UPDATE course SET courseName = ? WHERE courseID = ?';
      await query(updateSql, [newCourseName, courseID]);

      res.status(200).json({ message: 'Course name updated successfully' });
    } catch (error) {
      console.error('Error updating course name:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
