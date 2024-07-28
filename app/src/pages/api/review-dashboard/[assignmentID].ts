import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';
import { getStudentsById } from '../../../db'; // Import the function to get studentID

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assignmentID } = req.query;
  const userID = req.query.userID as string;

  if (req.method === 'GET') {
    try {
      if (!userID || !assignmentID) {
        return res.status(400).json({ message: 'Missing userID or assignmentID' });
      }

      // Convert userID to studentID
      const student = await getStudentsById(Number(userID));
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      const studentID = student.studentID;

      // Fetch the review groups for the assignment and student
      const reviewGroups = await getReviewGroups(Number(assignmentID), studentID);

      // Fetch the submissions and student names for each review group
      const submissions = await Promise.all(
        reviewGroups.map(async (reviewGroup: { submissionID: number; anonymous: any; }) => {
          const submission = await getSubmission(reviewGroup.submissionID);
          let studentName = null;
          if (!reviewGroup.anonymous) {
            if (submission[0]?.studentID !== undefined) {
              const student = await getStudent(submission[0].studentID);
              //console.log('student:', student);
              studentName = student.studentID;
            } else {
              console.error(`No studentID for submissionID: ${reviewGroup.submissionID}`);
            }
          }
          return { ...submission[0], studentName };
        })
      );

      // Fetch the review criteria for the assignment
      const reviewCriteria = await getReviewCriteria(Number(assignmentID));

      res.status(200).json({ reviewCriteria, submissions });
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching review data', error: error.message });
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

async function getReviewGroups(assignmentID: number, studentID: number) {
  const sql = `
    SELECT *
    FROM review_groups
    WHERE assignmentID = ? AND studentID = ?
  `;

  try {
    const reviewGroups = await query(sql, [assignmentID, studentID]);
    return reviewGroups;
  } catch (error) {
    console.error('Error fetching review groups:', error);
    throw error;
  }
}

async function getSubmission(submissionID: number) {
  const sql = `
    SELECT *
    FROM submission
    WHERE submissionID = ?
  `;

  try {
    const submission = await query(sql, [submissionID]);
    return submission;
  } catch (error) {
    console.error('Error fetching submission:', error);
    throw error;
  }
}

async function getStudent(studentID: number) {
  const sql = `
    SELECT *
    FROM student
    WHERE studentID = ?
  `;

  try {
    const student = await query(sql, [studentID]);
    return student;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
}