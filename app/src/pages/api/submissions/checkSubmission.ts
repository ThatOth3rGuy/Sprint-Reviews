// pages/api/submissions/checkSubmission.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assignmentID, userID } = req.query;

  if (!assignmentID || !userID) {
    return res.status(400).json({ error: 'Missing assignmentID or userID' });
  }

  try {
    console.log('Checking submission status for assignment', assignmentID, 'and user', userID);
    const result = await checkSubmission(Number(assignmentID), Number(userID));
    return res.json(result);
  } catch (error) {
    console.error('Error checking submission status:', error);
    return res.status(500).json({ error: 'Error checking submission status' });
  }
}



async function checkSubmission(assignmentID: number, userID: number): Promise<{
  isSubmitted: boolean,
  submissionDate: string | null,
  submissionID: number | null,
  fileName: string | null,
  studentName: string | null,
  isLate: boolean,
  isLink: boolean
}> {
  const sql = `
    SELECT s.*, st.studentID, st.userID, a.deadline, CONCAT(u.firstName, ' ', u.lastName) as studentName 
    FROM submission s
    JOIN student st ON s.studentID = st.studentID
    JOIN user u ON st.userID = u.userID
    JOIN assignment a ON s.assignmentID = a.assignmentID
    WHERE s.assignmentID = ? AND st.studentID = ?
  `;
  try {
    const rows = await query(sql, [assignmentID, userID]);
    console.log(rows);
    if (rows.length > 0) {
      const submissionDate = new Date(rows[0].submissionDate);
      const deadlineDate = new Date(rows[0].deadline);
      const isLate = submissionDate > deadlineDate;
      const isLink = rows[0].fileType === 'link';
      return {
        isSubmitted: true,
        submissionDate: submissionDate.toISOString(),
        submissionID: rows[0].submissionID,
        fileName: rows[0].fileName,
        studentName: rows[0].studentName,
        isLate,
        isLink
      };
    } else {
      return { isSubmitted: false, submissionDate: null, submissionID: null, fileName: null, studentName: null, isLate: false, isLink: false };


    }
  } catch (error) {
    console.error('Error in checkSubmission:', error);
    throw error;
  }
}