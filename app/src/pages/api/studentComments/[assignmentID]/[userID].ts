import { NextApiRequest, NextApiResponse } from 'next';
import { query, getStudentsById } from '../../../../db'; // Adjust the path to your DB connection module

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assignmentID, userID } = req.query;

  
  const studentID = await getStudentsById(Number(userID));// converts userID to  studentID 
  
  if (req.method === 'GET') {
    try {
      const result = await query(
        `SELECT feedbackID, comment, feedbackDate, lastUpdated 
         FROM instructor_feedback 
         WHERE assignmentID = ? AND studentID = ?
         ORDER BY feedbackDate DESC`,
        [assignmentID, studentID]
      );
      res.status(200).json(result);
      console.log(result);
      console.log("StudentID: ",studentID);
        console.log("assignmentID: ",assignmentID);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching comments' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}