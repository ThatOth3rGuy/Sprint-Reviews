// pages/api/groups/getGroupDetails.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';

async function getGroupDetails(courseID: number, studentID: number) {
  const studentIDSQL = `SELECT studentID FROM user JOIN student ON user.userID = student.userID WHERE user.userID = ?`;
  const sql = `
    SELECT groupID
    FROM course_groups
    WHERE courseID = ? AND studentID = ?
  `;

  try {
    const studentResult = await query(studentIDSQL, [studentID]);
    const result = await query(sql, [courseID, studentResult[0].studentID]);
    const groupID = result[0].groupID;

    const studentSQL = `
      SELECT studentID
      FROM course_groups
      WHERE courseID = ? AND groupID = ?
    `;

    const studentResults = await query(studentSQL, [courseID, groupID]);
    const studentIDs = studentResults.map((row: any) => row.studentID);

    return { groupID, studentIDs };
  } catch (error) {
    console.error('Error in getGroupDetails:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { courseID, studentID } = req.query;

  try {
    const groupDetails = await getGroupDetails(parseInt(courseID as string), parseInt(studentID as string));
    res.status(200).json(groupDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group details' });
  }
}
