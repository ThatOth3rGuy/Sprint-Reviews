// pages/api/courses/[courseID].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { courseID } = req.query;

  if (typeof courseID !== 'string') {
    res.status(400).json({ error: 'Invalid courseID' });
    return;
  }

  try {
    const course = await getCourse(courseID);

    if (course) {
      res.status(200).json(course);
      console.log(course)
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getCourse(studentID: string): Promise<any> {
    const sql = `
      SELECT c.courseID, courseName, instructorID, isArchived 
      FROM course c JOIN enrollment e ON c.courseID= e.courseID JOIN user u ON u.userID=c.instructorID
      WHERE studentID = ? AND isArchived=0 `;
    try {
      const rows = await query(sql, [studentID]);
      return rows;
    } catch (error) {
      console.error('Error in getCourse:', error);
      throw error;
    }
  }