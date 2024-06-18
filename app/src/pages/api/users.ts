// users.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await query('SELECT * FROM user');
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred.' });
  }
}