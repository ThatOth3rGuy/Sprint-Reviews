// pages/api/assignments/[assignmentID].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import {  query} from '../../../db'; // Import your actual data fetching function here

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assignmentID } = req.query;

  if (typeof assignmentID !== 'string') {
    res.status(400).json({ error: 'Invalid assignmentID' });
    return;
  }

  try {
    const Assignment = await getAssignmentById(assignmentID);

    if (Assignment) {
      res.status(200).json(Assignment);
    } else {
      res.status(404).json({ error: 'Assignment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getAssignmentById(assignmentID: string): Promise<any> {
  const sql = `
    SELECT assignmentID, title, descr, deadline, allowedFileTypes FROM assignment WHERE assignmentID = ?  `;
  try {
    const rows = await query(sql, [assignmentID]);
    return rows[0];
  } catch (error) {
    console.error('Error in getCourse:', error);
    throw error;
  }
  }