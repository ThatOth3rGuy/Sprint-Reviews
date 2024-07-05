// pages/api/getStudentsInCourse.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getStudentsInCourse } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { courseID } = req.query;

    try {
      const students = await getStudentsInCourse(courseID as string);
      res.status(200).json(students);
    } catch (error) {
      const err = error as Error;
      console.error('Failed to fetch students:', err.message);
      res.status(500).json({ error: `Failed to fetch students`, details: err.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
