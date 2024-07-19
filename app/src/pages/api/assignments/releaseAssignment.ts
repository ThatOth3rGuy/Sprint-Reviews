import { NextApiRequest, NextApiResponse } from 'next';
import { query,createReview,addReviewCriteria } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { assignmentID, rubric, isGroupAssignment, allowedFileTypes, deadline } = req.body;

    try {
      console.log('Creating review...');
      await createReview(assignmentID, isGroupAssignment, allowedFileTypes, new Date(deadline));

      console.log('Adding review criteria...');
      await addReviewCriteria(assignmentID, rubric);

      res.status(200).json({ message: 'Assignment released for review successfully' });
    } catch (error) {
      console.error('Error releasing assignment for review:', error);
      res.status(500).json({ message: 'An error occurred while releasing the assignment for review' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

