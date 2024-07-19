import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      const { courseID } = req.query;
      try {
        const reviews = await getPeerReviewAssignmentsByCourseID(Number(courseID));
        console.log('API response:', reviews);
        res.status(200).json({ reviews });
      } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
      }
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  }
async function getPeerReviewAssignmentsByCourseID(courseID: number) {
    const sql = `
      SELECT r.reviewID as assignmentID, r.assignmentID as linkedAssignmentID, r.deadline
    FROM review r
    JOIN assignment a ON r.assignmentID = a.assignmentID
    WHERE a.courseID = ?
    `;
    try {
      const rows = await query(sql, [courseID]);
      return rows;
    } catch (error) {
      console.error('Error in getPeerReviewAssignmentsByCourseID:', error);
      throw error;
    }
  }
  