// pages/api/peer-reviews/[studentID].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db'; // Adjust this import based on your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { studentID } = req.query;

  if (req.method === 'GET') {
    try {
      const sql = `
        SELECT r.reviewID, a.assignmentID, a.title, a.deadline, c.courseID, c.courseName
        FROM review r
        JOIN assignment a ON r.assignmentID = a.assignmentID
        JOIN course c ON a.courseID = c.courseID
        JOIN selected_students ss ON r.assignmentID = ss.assignmentID
        WHERE ss.studentID = ?
      `;
      
      const results = await query(sql, [studentID]);

      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching peer reviews', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}