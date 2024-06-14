import type { NextApiRequest, NextApiResponse } from 'next';
import { addUserToDatabase } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, password, role } = req.body;
    try {
      await addUserToDatabase(firstName, lastName, email, password, role);
      res.status(200).json({ message: 'User added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding user to database' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}