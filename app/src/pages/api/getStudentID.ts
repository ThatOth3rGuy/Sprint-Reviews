// pages/api/getStudentId.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {

    const userID = req.query.userID;

    if (!userID) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      const sql = `
        SELECT s.userID as studentId
        FROM user u
        JOIN student s ON u.userID = s.userID
        WHERE u.userID = ? AND u.userRole = 'student'
      `;
      const result = await query(sql, [userID]);

      if (result.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.status(200).json({ studentId: result[0].studentId });
    } catch (error) {
      console.error('Error fetching student ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}