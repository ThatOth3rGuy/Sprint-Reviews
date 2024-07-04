// /pages/api/getCourses.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { isArchived } = req.query;
    const courses = await getAllCourses(isArchived === 'true');
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error in getCourses API:', error); // Log the error
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
export async function getAllCourses(isArchived: boolean): Promise<any[]> {
  const sql = `
    SELECT 
      course.courseID,
      course.courseName,
      user.firstName AS instructorFirstName,
      user.lastName AS instructorLastName,
      COALESCE(AVG(submission.grade), 0) AS averageGrade
    FROM course
    JOIN instructor ON course.instructorID = instructor.userID
    JOIN user ON instructor.userID = user.userID
    LEFT JOIN assignment ON course.courseID = assignment.courseID
    LEFT JOIN submission ON assignment.assignmentID = submission.assignmentID
    WHERE course.isArchived = ?
    GROUP BY course.courseID, user.userID
  `;
  try {
    const rows = await query(sql, [isArchived]);
    return rows.map((row: { averageGrade: string | null; }) => ({
      ...row,
      averageGrade: row.averageGrade !== null ? parseFloat(row.averageGrade) : null,
    }));
  } catch (error) {
    console.error('Error in getAllCourses:', error); // Log the error
    throw error;
  }
}