// pages/api/reviews/releaseReviews.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { assignmentID } = req.body;

  if (!assignmentID) {
    return res.status(400).json({ error: 'Assignment ID is required' });
  }

  try {
    const sql = 'UPDATE review_groups SET isReleased = TRUE WHERE assignmentID = ?';
    await query(sql, [assignmentID]);

    res.status(200).json({ message: 'Reviews released successfully' });
  } catch (error) {
    console.error('Error in releaseReviews API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
