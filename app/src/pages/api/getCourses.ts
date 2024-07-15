// src/pages/api/getCourses.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCoursesByStudentID } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { studentID } = req.query;

  if (!studentID || Array.isArray(studentID)) {
    return res.status(400).json({ error: 'Invalid student ID' });
  }

  try {
    const courses = await getCoursesByStudentID(parseInt(studentID, 10));
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}
