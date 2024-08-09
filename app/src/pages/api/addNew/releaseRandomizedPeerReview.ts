// This file is responsible for creating the peer review groups for a given assignment.
// It is called after the peer review assignment has been created and viewed by the instructor on the peer review dashboard
// The API endpoint will release the randomized peer review groups to the students once the draft is approved by the instructor.

import type { NextApiRequest, NextApiResponse } from 'next';
import { selectStudentForSubmission, query } from '../../../db';
import { randomizePeerReviewGroups } from './randomizationAlgorithm';

type ReviewGroup = {
  revieweeID: number;
  reviewers: number[];
};

// This function will insert the rows of students to review the single submission, 
// for each submission in the peerReviewGroups array, connected to the courseID and assignmentID.
const processPeerReviewGroups = async (peerReviewGroups: ReviewGroup[], assignmentID: number, courseID: number) => {
  for (const group of peerReviewGroups) {
    for (const student of group.reviewers) {
      await selectStudentForSubmission(student, assignmentID, courseID, group.revieweeID); // Insert the student to review the submission of the reviewee
    }
  }
};
// The handler function receives the request body containing the reviewsPerAssignment, students, and assignmentID.
// The reviewsPerAssignment specifies the number of reviews each student should complete.
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' }); // Return error if method is not POST
  }

  const { reviewsPerAssignment, students, assignmentID } = req.body; // Get the reviewsPerAssignment, students, and assignmentID from the request body

  // Check if the required fields are missing or invalid
  if (!reviewsPerAssignment || !assignmentID || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    // Get the courseID from the assignmentID to associate the peer review groups with the course and assignment and check if the assignment exists (result is not empty)
    const sql = `SELECT courseID FROM assignment WHERE assignmentID = ?`;
    const result = await query(sql, [assignmentID]);

    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Course ID not found for the given assignment ID' });
    }

    const courseID = result[0].courseID; // Get the courseID from the result of the query

    console.log('Students:', students); // Log the students array to the console for debugging

    // Call the randomizePeerReviewGroups function to create the peer review groups
    const peerReviewGroups = randomizePeerReviewGroups(students, reviewsPerAssignment);

    console.log('Peer review groups:', peerReviewGroups);

    // Process the peer review groups by inserting the rows of students to review the single submission for each submission in the peerReviewGroups array 
    await processPeerReviewGroups(peerReviewGroups, assignmentID, courseID);

    res.status(201).json({ message: 'Peer review groups created successfully', peerReviewGroups }); // Return success message with the peer review groups
  } catch (error) {
    res.status(500).json({ error: 'Error creating peer review groups', details: (error as Error).message }); // Return error message with details
  }
};

export default handler; // Export the handler function
