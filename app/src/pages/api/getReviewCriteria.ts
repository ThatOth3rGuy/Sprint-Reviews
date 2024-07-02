import { NextApiRequest, NextApiResponse } from 'next';
import { getReviewCriteria } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assignmentID } = req.query;

  try {
    const reviewCriteria = await getReviewCriteria(Number(assignmentID));
    res.status(200).json(reviewCriteria);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Failed to get review criteria' });
  }
}
