// pages/api/createCourse.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createCourse } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { courseName, instructorID } = req.body;
    try {
      const courseId = await createCourse(courseName, instructorID);
      res.status(201).json({ courseId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create course' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}