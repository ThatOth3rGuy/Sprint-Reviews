import type { NextApiRequest, NextApiResponse } from 'next';
import { getAssignments } from '../../db';

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const assignments = await getAssignments();
      res.status(200).json(assignments);
    } catch (error: unknown) {
      console.error('Error fetching assignments:', error);
      
      if (isError(error)) {
        res.status(500).json({ 
          message: 'An error occurred while fetching the assignments',
          error: error.message
        });
      } else {
        res.status(500).json({ 
          message: 'An unknown error occurred while fetching the assignments'
        });
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}