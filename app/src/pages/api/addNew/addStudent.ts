// This file is used to add a new student to the database
// Calls the createStudent and createUser functions from the db file as the User model is used to create the student
// Used in User registration and student portal for student registration
import type { NextApiRequest, NextApiResponse } from 'next';
import { addStudentNotification, createStudent, createUser } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Get the user details from the request body to store general user information
    const { firstName, lastName, email, password, role, studentID } = req.body;
    try {
      // Create the user with the user details provided (role is student)
      const userID = await createUser(firstName, lastName, email, password, role);

      // Create the student with the user ID returned from the createUser function and add notifications for that studentID
      await createStudent(studentID, userID);
      await addStudentNotification(studentID)

      res.status(200).json({ message: 'User added successfully' }); // Return success message
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding user to database' }); // Return error message
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' }); // Return error if method is not POST
  }
}