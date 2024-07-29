// File: pages/api/reviews/submitReviews.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { assignmentID, reviews } = req.body;

    if (!assignmentID || !Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    await query('START TRANSACTION');

    try {
      for (const review of reviews) {
        const { submissionID, feedbackDetails, comment } = review;

        if (!submissionID || !feedbackDetails || !comment) {
          throw new Error('Invalid review data: missing submissionID, feedbackDetails, or comment');
        }

        const existingFeedback = await query(
          'SELECT feedbackID FROM feedback WHERE submissionID = ? AND assignmentID = ?',
          [submissionID, assignmentID]
        );

        if (existingFeedback.length > 0) {
          await query(
            'UPDATE feedback SET feedbackDetails = ?, comment = ?, lastUpdated = NOW() WHERE submissionID = ? AND assignmentID = ?',
            [JSON.stringify(feedbackDetails), comment, submissionID, assignmentID]
          );
        } else {
          await query(
            'INSERT INTO feedback (submissionID, assignmentID, feedbackDetails, comment, feedbackDate, lastUpdated) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [submissionID, assignmentID, JSON.stringify(feedbackDetails), comment]
          );
        }
      }

      await query('COMMIT');
      res.status(200).json({ message: 'Reviews submitted successfully' });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error submitting reviews:', error);
    res.status(500).json({ message: 'Error submitting reviews', error: (error as Error).message });
  }
}