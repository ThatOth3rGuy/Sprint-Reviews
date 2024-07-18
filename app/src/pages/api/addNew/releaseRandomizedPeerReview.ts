/*
* This API call is used to randomly assign peer reviews to students.
* It will take an int as the number of peer reviews per assignment, 
* an array of student IDs mapped to their submissionID, an assignmentID, and a courseID.
* It then calls the randomization function to assignment a list of students to review it, before calling the database query to add them.
*/

// /pages/api/createNew/releaseRandomizedPeerReview.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { selectStudentForSubmission } from '../../../db';

type Student = {
  studentID: number;
  submissionID: number;
};

type ReviewGroup = {
  submissionID: number;
  reviewers: number[];
};

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

  // Shuffle function to randomize an array using the Fisher-Yates algorithm
  const shuffleArray = (array: any[]): void => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Initialize the review groups for each submission
  const submissionReviews: { [key: number]: number[] } = {};
  students.forEach(student => {
    if (!submissionReviews[student.submissionID]) {
      submissionReviews[student.submissionID] = [];
    }
  });

  // Create a map to keep track of how many reviews each student has done
  const studentReviewsCount: { [key: number]: number } = {};
  students.forEach(student => {
    studentReviewsCount[student.studentID] = 0;
  });

  // First pass: Ensure every student reviews the minimum number of assignments
  for (let student of students) {
    const studentID = student.studentID;

    // Skip this student if they've already reviewed enough assignments
    if (studentReviewsCount[studentID] >= reviewsPerAssignment) continue;

    // Create a list of all possible reviews (excluding own submission)
    const possibleReviews = students
      .filter(s => s.studentID !== studentID && s.submissionID !== student.submissionID)
      .map(s => s.submissionID);

    // Shuffle the possible reviews to ensure randomness
    shuffleArray(possibleReviews);

    // Assign reviews from the shuffled list until the student reaches the review limit
    for (let reviewSubmissionID of possibleReviews) {
      if (studentReviewsCount[studentID] >= reviewsPerAssignment) break;
      if (submissionReviews[reviewSubmissionID].length >= reviewsPerAssignment) continue;

      submissionReviews[reviewSubmissionID].push(studentID);
      studentReviewsCount[studentID]++;
    }
  }

  // Verify and adjust: Ensure every submission gets exactly minReviewsPerSubmission reviews
  const allSubmissions = students.map(student => student.submissionID);

  for (const submissionID of allSubmissions) {
    while (submissionReviews[submissionID].length < reviewsPerAssignment) {
      // Filter potential reviewers who have not reviewed this submission and have not reached their review limit
      const potentialReviewers = students.filter(student =>
        student.submissionID !== Number(submissionID) &&
        !submissionReviews[submissionID].includes(student.studentID) &&
        studentReviewsCount[student.studentID] < reviewsPerAssignment
      );

      // If no valid reviewers found, assign any student who hasn't reviewed this submission yet
      if (potentialReviewers.length === 0) {
        const excessReviewers = students.filter(student =>
          student.submissionID !== Number(submissionID) &&
          !submissionReviews[submissionID].includes(student.studentID)
        );

        shuffleArray(excessReviewers);
        const reviewer = excessReviewers[0];
        submissionReviews[submissionID].push(reviewer.studentID);
        studentReviewsCount[reviewer.studentID]++;
      } else {
        // Shuffle the potential reviewers to ensure randomness
        shuffleArray(potentialReviewers);
        const reviewer = potentialReviewers[0];
        submissionReviews[submissionID].push(reviewer.studentID);
        studentReviewsCount[reviewer.studentID]++;
      }
    }
  }

  // Convert submissionReviews object to array of objects for the required format
  const result: ReviewGroup[] = Object.keys(submissionReviews).map(submissionID => ({
    submissionID: Number(submissionID),
    reviewers: submissionReviews[Number(submissionID)]
  }));

  return result;
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
