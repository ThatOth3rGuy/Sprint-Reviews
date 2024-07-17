import type { NextApiRequest, NextApiResponse } from 'next';
import { updateAssignment, addReviewCriteria } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { assignmentID, rubric, isGroupAssignment, allowedFileTypes, deadline } = req.body;

    try {
      // Update assignment details
      await updateAssignment(assignmentID, isGroupAssignment, allowedFileTypes, new Date(deadline));

      // Add review criteria
      await addReviewCriteria(assignmentID, rubric);

      res.status(200).json({ message: 'Assignment released successfully' });
    } catch (error) {
      console.error('Error releasing assignment:', error);
      res.status(500).json({ message: 'An error occurred while releasing the assignment' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}