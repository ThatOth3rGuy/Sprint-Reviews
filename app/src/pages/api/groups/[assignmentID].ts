import type { NextApiRequest, NextApiResponse } from 'next';
import { getReviewGroups,getStudentSubmissions } from '../../../db'; // Import your actual data fetching function here

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assignmentID } = req.query;
  try {
    const submission = await getStudentSubmissions(Number(assignmentID));
    console.log('API response:', submission.length);
    for (const sub of submission) {
      const submissions = await getReviewGroups(undefined,Number(assignmentID), sub.submissionID, undefined);
      res.status(200).json({ ...submissions, submissions });
    }
      res.status(404).json({ error: 'ReviewGroup not found' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}