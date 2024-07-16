import type { NextApiRequest, NextApiResponse } from 'next';
import { createStudent, createUser } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { uID, firstName, lastName, email, password, role } = req.body;
    try {
      // Create the user
      const accId = await createUser(firstName, lastName, email, password, role);

      // Create the student with the user ID 
      await createStudent(uID, accId);

      res.status(200).json({ message: 'User added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding user to database' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}