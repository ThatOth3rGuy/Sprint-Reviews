import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { courseID } = req.query;
    try {
      const courses = await getAssignmentByInstructorID(Number(courseID));
      res.status(200).json({ courses });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
async function getAssignmentByInstructorID(courseID: number) {
  const sql = `
    SELECT assignmentID, title, deadline, descr
    FROM assignment
    WHERE courseID = ? 
  `;
  try {
    const results = await query(sql, [courseID]);
    return results;
  } catch (error) {
    console.error('Error in getAssignmentByInstructorID:', error);
    throw error;
  }
}