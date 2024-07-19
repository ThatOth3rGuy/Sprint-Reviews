/*
* This API call is used to randomly assign peer reviews to students.
* It will take an int as the number of peer reviews per assignment, 
* an array of student IDs mapped to their submissionID, an assignmentID, and a courseID.
* It then calls the randomization function to assignment a list of students to review it, before calling the database query to add them.
*/

// /pages/api/createNew/releaseRandomizedPeerReview.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { selectStudentForSubmission } from '../../../db';
import { randomizePeerReviewGroups } from './randomizationAlgorithm';

type ReviewGroup = {
  submissionID: number;
  reviewers: number[];
};

// This function will insert the rows of students to review the single submission, 
// for each submission in the peerReviewGroups array, connected to the courseID and assignmentID.
const processPeerReviewGroups = async (peerReviewGroups: ReviewGroup[], assignmentID: Number, courseID: Number) => {
  for (const group of peerReviewGroups) {
    for (const student of group.reviewers) {
      await selectStudentForSubmission(student, assignmentID, courseID, group.submissionID);
    }
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reviewsPerAssignment, studentSubmissions, assignmentID, courseID } = req.body;

  if (!reviewsPerAssignment || !assignmentID || !Array.isArray(studentSubmissions) || studentSubmissions.length === 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    // Call the randomizePeerReviewGroups function to create the peer review groups
    const peerReviewGroups = randomizePeerReviewGroups(studentSubmissions, reviewsPerAssignment);

    // Call the randomizePeerReviewGroups function to create the peer review groups
    processPeerReviewGroups(peerReviewGroups, assignmentID, courseID);

    res.status(201).json({ message: 'Peer review groups created successfully', peerReviewGroups });
  } catch (error) {
    res.status(500).json({ error: 'Error creating peer review groups', details: (error as Error).message });
  }
};

export default handler;
