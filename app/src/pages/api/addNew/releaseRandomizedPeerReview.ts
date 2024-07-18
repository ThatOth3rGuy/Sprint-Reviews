/*
* This API call is used to randomly assign peer reviews to students.
* It will take an int as the number of peer reviews per assignment, 
* an array of student IDs mapped to their submissionID, an assignmentID, and a courseID.
* It then calls the randomization function to assignment a list of students to review it, before calling the database query to add them.
*/

// /pages/api/createNew/releaseRandomizedPeerReview.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { selectStudentForSubmission } from '../../../db';

const randomizePeerReviewGroups = (students: { studentID: number, submissionID: number }[], reviewsPerAssignment: number) => {
  // This function will randomize the students and assign them to peer review groups

    /*
    - Loops through each student in course and randomly assigns them to X submission for review
    - Each student must have minimum submissions to review as directed by instructor and no more than provided maximum
    - No student can review their own submission or have more than 1 instance of any submission
    - If any students are manually selected for review of a particular submission they are not considered for that iteration
    */

    // It returns an array of objects, where each object contains the submission ID 
    // and the list of student IDs that are assigned to review that specific submission.
    // (Or a 2d array, or any other data type that can represent this information)
    return [];
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
    const peerReviewGroups = randomizePeerReviewGroups(studentSubmissions, reviewsPerAssignment);

    // This function will insert the rows of students to review the single submission, 
    // for each submission in the peerReviewGroups array, connected to the courseID and assignmentID.
    for (const group of peerReviewGroups) {
      for (const student of group) {
        await selectStudentForSubmission(student, assignmentID, courseID, group); //group is the submissionID
      }
    }

    res.status(201).json({ message: 'Peer review groups created successfully', peerReviewGroups });
  } catch (error) {
    res.status(500).json({ error: 'Error creating peer review groups', details: (error as Error).message });
  }
};

export default handler;
