// This file is responsible for fetching the list of student submissions for a given assignment
import type { NextApiRequest, NextApiResponse } from 'next';
import { getStudentSubmissions } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { assignmentID } = req.query;
    try {
      const studentSubmissions = await getStudentSubmissions(Number(assignmentID));
      const formattedSubmissions = studentSubmissions.map(submission => ({
      studentID: submission.studentID,
      submissionID: submission.submissionID
    }));
    res.status(200).json({ formattedSubmissions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}