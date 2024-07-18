import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { instructorID } = req.query;
    try {
      const courses = await getCoursesByInstructorID(Number(instructorID));
      res.status(200).json({ courses });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

async function getCoursesByInstructorID(instructorID: number) {
  const sql = `
    SELECT courseID, courseName, userID
    FROM course c join instructor i on c.instructorID=i.instructorID
    WHERE userID = ? AND isArchived = false
  `;
  try {
    const results = await query(sql, [instructorID]);
    return results;
  } catch (error) {
    console.error('Error in getCoursesByInstructorID:', error);
    throw error;
  }
}