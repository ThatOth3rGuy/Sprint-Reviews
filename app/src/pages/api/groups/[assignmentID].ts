import type { NextApiRequest, NextApiResponse } from 'next';
import { getReviewGroups, getStudentSubmissions } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assignmentID } = req.query;
  try {
    const submissions = await getStudentSubmissions(Number(assignmentID));
    console.log('API response:', submissions.length);

    const allGroups = [];
    for (const sub of submissions) {
      const group = await getReviewGroups(undefined, Number(assignmentID), sub.submissionID, undefined);
      if (group.length > 0) {
        allGroups.push(group);
      }
    }

    if (allGroups.length > 0) {
      res.status(200).json({ groups: allGroups });
    } else {
      res.status(404).json({ error: 'No review groups found' });
    }
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}