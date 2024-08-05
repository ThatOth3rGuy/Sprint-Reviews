// This file is used to add a new instructor to the database
// Calls the createInstructor and createUser functions from the db file as the User model is used to create the instructor
// Used in User registration under the instructor role portal
import type { NextApiRequest, NextApiResponse } from 'next';
import { createInstructor, createUser } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Get the user details from the request body
    const { uID, firstName, lastName, email, password, role, instructorID } = req.body;
    try {
      // Create the user via the createUser function from the db file
      const userID = await createUser(firstName, lastName, email, password, role);

      // Create the instructor via the createInstructor function from the db file all new instructors are not admins
      await createInstructor(instructorID, userID, false);

      res.status(200).json({ message: 'User added successfully' }); // Return success message
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding user to database' }); // Return error message
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' }); // Return error if method is not POST
  }
}