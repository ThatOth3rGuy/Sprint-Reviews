// pages/api/peer-reviews/[assignmentID]/[studentID].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../../db'; // Import your database query function

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assignmentID, studentID } = req.query;

  if (typeof assignmentID !== 'string' || typeof studentID !== 'string') {
    res.status(400).json({ error: 'Invalid assignmentID or studentID' });
    return;
  }

  try {
    const feedbacks = await getFeedbacksForAssignment(assignmentID, studentID);
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getFeedbacksForAssignment(assignmentID: string, studentID: string) {
  const sql = `
    SELECT f.feedbackID, f.submissionID, f.feedbackDetails, f.feedbackDate, f.lastUpdated, f.comment
    FROM feedback f
    JOIN submission s ON f.submissionID = s.submissionID
    WHERE f.assignmentID = ? AND s.studentID = ?
  `;
  try {
    const rows = await query(sql, [assignmentID, studentID]);
    return rows;
  } catch (error) {
    console.error('Error in getFeedbacksForAssignment:', error);
    throw error;
  }
}