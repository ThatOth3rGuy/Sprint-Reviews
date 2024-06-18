import type { NextApiRequest, NextApiResponse } from 'next';
import { getAssignments } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const assignments = await getAssignments();
      res.status(200).json(assignments);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the assignments' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
