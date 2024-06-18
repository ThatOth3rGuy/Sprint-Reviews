// pages/api/auth/instructor-login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateInstructor } from '../../../db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const isAuthenticated = await authenticateInstructor(email, password);
      if (isAuthenticated) {
        res.status(200).json({ message: 'Authenticated' });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
