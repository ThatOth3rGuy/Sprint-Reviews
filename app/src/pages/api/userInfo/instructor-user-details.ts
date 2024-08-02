import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db'; // Import your actual data fetching function here

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // ... (keep the existing GET logic)
  } else if (req.method === 'PUT') {
    const { userID, firstName, lastName, email, instructorID } = req.body;

    if (!userID) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      // Start a transaction
      

      // Update user table
      if (firstName || lastName || email) {
        const updateFields = [];
        const params = [];

        if (firstName) {
          updateFields.push('firstName = ?');
          params.push(firstName);
        }
        if (lastName) {
          updateFields.push('lastName = ?');
          params.push(lastName);
        }
        if (email) {
          updateFields.push('email = ?');
          params.push(email);
        }

        const userUpdateSql = `UPDATE user SET ${updateFields.join(', ')} WHERE userID = ?`;
        await query(userUpdateSql, [...params, userID]);
      }

      // Handle instructorID update
      if (instructorID !== undefined) {
        // Check if the instructor record exists
        const existingInstructor = await query('SELECT * FROM instructor WHERE userID = ?', [userID]);
        
        if (existingInstructor.length === 0) {
          // If no existing record, simply insert a new one
          await query('INSERT INTO instructor (instructorID, userID) VALUES (?, ?)', [instructorID, userID]);
        } else {
          const oldInstructorID = existingInstructor[0].instructorID;
          
          // Create a new instructor record
          await query('INSERT INTO instructor (instructorID, userID) VALUES (?, ?)', [instructorID, userID]);
          
          // Update all related records in the course table
          await query('UPDATE course SET instructorID = ? WHERE instructorID = ?', [instructorID, oldInstructorID]);
          
          // Delete the old instructor record
          await query('DELETE FROM instructor WHERE instructorID = ?', [oldInstructorID]);
        }
      }

      // Commit the transaction
 

      // Fetch updated user details
      const updatedUser = await query(`
        SELECT u.firstName, u.lastName, u.email, i.instructorID
        FROM user u
        LEFT JOIN instructor i ON u.userID = i.userID
        WHERE u.userID = ?
      `, [userID]);

      return res.status(200).json(updatedUser[0]);
    } catch (error) {
      // Rollback the transaction in case of error
      
      console.error('Error updating user details:', error);
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}