/*
* This API call is used to randomly assign peer reviews to students.
* It will take an int as the number of peer reviews per assignment, an array of student IDs mapped to their assignmentID.
* It then calls the randomization function to give each student assignments to review, before calling the database query to add them.
*/

// /pages/api/createNew/releaseRandomizedPeerReview.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { releaseRandomizedPeerReviews } from '../../../db';

const randomizePeerReviewGroups = (students: { studentID: number, assignmentID: number }[], reviewsPerAssignment: number) => {
  // This function will randomize the students and assign them to peer review groups

    /*
    - Loops through each student in course and randomly assigns them to X assignments for review
    - Each student must have minimum assignments to review as directed by instructor and no more than provided maximum
    - No student can review their own assignment or have more than 1 instance of any assignment
    - If any students are manually selected for review of a particular assignment they are not considered for that iteration
    */

    // It returns an array of objects, where each object contains the student ID 
    // and the list of assignment IDs they are assigned to review.
    // (Or a 2d array, or any other data type that can represent this information)
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reviewsPerAssignment, studentAssignments } = req.body;

  if (!reviewsPerAssignment || !Array.isArray(studentAssignments) || studentAssignments.length === 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const peerReviewGroups = randomizePeerReviewGroups(studentAssignments, reviewsPerAssignment);

    await releaseRandomizedPeerReviews(peerReviewGroups);

    res.status(201).json({ message: 'Peer review groups created successfully', peerReviewGroups });
  } catch (error) {
    res.status(500).json({ error: 'Error creating peer review groups', details: (error as Error).message });
  }
};

export default handler;
