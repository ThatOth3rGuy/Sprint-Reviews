// pages/api/getAssignment.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAssignmentForStudentView } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid assignment ID' });
    }

    try {
      const assignmentId = parseInt(id, 10);
      const assignment = await getAssignmentForStudentView(assignmentId);

      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      res.status(200).json(assignment);
    } catch (error: any) {
      console.error('Error in getAssignment:', error);
      res.status(500).json({ 
        message: 'An error occurred while fetching the assignment', 
        error: error.message 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}