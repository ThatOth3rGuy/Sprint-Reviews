import type { NextApiRequest, NextApiResponse } from 'next';
import { getReviewGroups } from '../../../db'; // Import your actual data fetching function here

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assignmentID } = req.query;
  try {
    const review = await getReviewGroups(undefined,Number(assignmentID), undefined, "submissionID");

    if (review) {
      res.status(200).json({ ...review });
    } else {
      res.status(404).json({ error: 'ReviewGroup not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}