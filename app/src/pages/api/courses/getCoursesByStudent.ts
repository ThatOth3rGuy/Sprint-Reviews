// getCourses.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';
import { getCoursesByStudentID } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

async function getCoursesByStudentID(studentID: number): Promise<any[]> {
  const sql = `SELECT c.courseID, c.courseName, u.firstName AS instructorFirstName, u.lastName AS instructorLastName
FROM enrollment e
JOIN course c ON e.courseID = c.courseID
JOIN instructor i ON c.instructorID = i.userID
JOIN user u ON i.userID = u.userID
WHERE e.studentID = ?
ORDER BY c.courseID`;
  try {
    console.log('Fetching courses for student:', studentID);
    const rows = await query(sql, [studentID]);
    return rows;
  } catch (error) {
    console.error('Error fetching courses for student:', error);
    throw error;
  }
}