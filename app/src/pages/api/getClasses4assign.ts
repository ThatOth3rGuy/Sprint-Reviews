//getClasses4assign.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getClasses } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const classes = await getClasses();
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the classes.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}
