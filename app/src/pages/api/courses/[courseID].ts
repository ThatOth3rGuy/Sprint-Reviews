// pages/api/courses/[courseID].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getCourse } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { courseID } = req.query;

  if (typeof courseID !== 'string') {
    res.status(400).json({ error: 'Invalid courseID' });
    return;
  }

  try {
    const course = await getCourse(Number(courseID));

    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
