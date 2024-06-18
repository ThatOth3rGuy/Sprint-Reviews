import type { NextApiRequest, NextApiResponse } from 'next';
import { addAssignmentToDatabase } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, description, dueDate, classID } = req.body;
    try {
      await addAssignmentToDatabase(title, description, dueDate, Number(classID));
      res.status(200).json({ message: 'Assignment created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while creating the assignment' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
