import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';
import { getStudentsById } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assignmentID } = req.query;
  const userID = req.query.userID as string;

  if (req.method === 'GET') {
    try {
      if (!userID || !assignmentID) {
        return res.status(400).json({ message: 'Missing userID or assignmentID' });
      }

      const student = await getStudentsById(Number(userID));
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      const studentID = student.studentID;

      const reviewGroups = await getReviewGroups(Number(assignmentID), studentID);
      const reviewCriteria = await getReviewCriteria(Number(assignmentID));

      const submissions = await Promise.all(
        reviewGroups.map(async (reviewGroup: { submissionID: number; anonymous: boolean; }) => {
          const submission = await getSubmission(reviewGroup.submissionID);
          let studentName = "Anonymous";

          if (!reviewGroup.anonymous) {
            const student = await getStudent(submission[0].studentID);
            if (student) {
              studentName = student.firstName + ' ' + student.lastName;
            }
          }

          return { ...submission[0], studentName };
        })
      );

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
    SELECT rg.*, r.anonymous
    FROM review_groups rg
    JOIN review r ON rg.assignmentID = r.assignmentID
    WHERE rg.assignmentID = ? AND rg.studentID = ?
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
    SELECT s.*, s.studentID
    FROM submission s
    WHERE s.submissionID = ?
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
    SELECT u.firstName, u.lastName
    FROM student s
    JOIN user u ON s.userID = u.userID
    WHERE s.studentID = ?
  `;

  try {
    const student = await query(sql, [studentID]);
    return student[0];
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
}
