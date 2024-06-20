// import type { NextApiRequest, NextApiResponse } from 'next';
// import { addAssignmentToDatabase } from '../../db';

import { query } from "@/db";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { title, description, dueDate, classID, file } = req.body;
//     try {
//       await addAssignmentToDatabase(title, description, dueDate, Number(classID), file);
//       res.status(200).json({ message: 'Assignment created successfully' });
//     } catch (error) {
//       res.status(500).json({ message: 'An error occurred while creating the assignment' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }
export async function handler(title: string, description: string, dueDate: string, classID: number, file:string) {
  const sql = `
    INSERT INTO assignment (title, description, deadline, classID, file)
    VALUES (?, ?, ?, ?, ?)
  `;
  try {
    await query(sql, [title, description, new Date(dueDate), classID, file]);
  } catch (error) {
    console.error('Error in addAssignmentToDatabase:', error); // Log the error
    throw error;
  }
}

