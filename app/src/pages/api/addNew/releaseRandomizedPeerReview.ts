/*
* This API call is used to create randomized peer review groups for a specific assignment.
* It will take an int as the number of peer reviews per assignment, an array of student IDs mapped to their assignmentID.
* It then calls the randomization function to create the groups, before calling the database query to add them.
*/

// /pages/api/create-peer-review-groups.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { insertPeerReviewGroups } from '../../../db';

const randomizePeerReviewGroups = (students: { studentID: number, assignmentID: number }[], reviewsPerAssignment: number) => {
  const peerReviewGroups: { assignmentID: number, reviewerID: number, revieweeID: number }[] = [];
  const shuffledStudents = students.sort(() => Math.random() - 0.5);

  for (const student of shuffledStudents) {
    const possibleReviewees = shuffledStudents.filter(s => s.studentID !== student.studentID && s.assignmentID === student.assignmentID);
    const selectedReviewees = possibleReviewees.slice(0, reviewsPerAssignment);

    selectedReviewees.forEach(reviewee => {
      peerReviewGroups.push({
        assignmentID: student.assignmentID,
        reviewerID: student.studentID,
        revieweeID: reviewee.studentID
      });
    });
  }

  return peerReviewGroups;
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

    await insertPeerReviewGroups(peerReviewGroups);

    res.status(201).json({ message: 'Peer review groups created successfully', peerReviewGroups });
  } catch (error) {
    res.status(500).json({ error: 'Error creating peer review groups', details: (error as Error).message });
  }
};

export default handler;
