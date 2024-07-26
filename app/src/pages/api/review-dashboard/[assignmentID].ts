// pages/api/review-dashboard/[assignmentID].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assignmentID } = req.query;

  if (req.method === 'GET') {
    try {
      const reviewCriteria = await getReviewCriteria(Number(assignmentID));
      const submission = await getSubmissionToReview(Number(assignmentID));

      res.status(200).json({ reviewCriteria, submission });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching review data', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getReviewCriteria(assignmentID: number) {
  const sql = `
    SELECT criteriaID, criterion, maxMarks
    FROM review_criteria
    WHERE assignmentID = ?
  `;
  
  try {
    const criteria = await query(sql, [assignmentID]);
    return criteria;
  } catch (error) {
    console.error('Error fetching review criteria:', error);
    throw error;
  }
}

async function getSubmissionToReview(assignmentID: number) {
  const sql = `
    SELECT s.submissionID, s.fileName, s.fileContent, s.fileType, s.submissionDate
    FROM submission s
    JOIN selected_students ss ON s.studentID = ss.studentID
    WHERE ss.assignmentID = ?
    LIMIT 1
  `;
  
  try {
    const submissions = await query(sql, [assignmentID]);
    if (submissions.length > 0) {
      const submission = submissions[0];
      // Convert fileContent to base64 if it's not null
      if (submission.fileContent) {
        submission.fileContent = submission.fileContent.toString('base64');
      }
      return submission;
    }
    return null;
  } catch (error) {
    console.error('Error fetching submission to review:', error);
    throw error;
  }
}