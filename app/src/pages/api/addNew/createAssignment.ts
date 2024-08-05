// createAssignment.ts
/*
  This file is an API route that creates a new assignment in the database.
  It is called from the CreateAssignment component in the frontend.
  The assignment is added to the course specified by the courseID in the request body.
  The assignment is specifically reffered to as an assignment created by instructors for students to complete, which will later be used to create a peer review assignment.
*/
import { NextApiRequest, NextApiResponse } from 'next';
import { addAssignmentToCourse } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Get the assignment details from the request body
    const { title, description, startDate, endDate, dueDate, file, groupAssignment, courseID, allowedFileTypes } = req.body;

    if (!title || !description || !dueDate || !courseID || !allowedFileTypes) { // Check if required fields are missing
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      console.log('Received courseID:', courseID);
      // Add the assignment to the course specified by the courseID and return the stored assignment details
      const result = await addAssignmentToCourse(title, description, startDate, endDate, dueDate, file, groupAssignment, Number(courseID), allowedFileTypes);
      console.log('Assignment creation result:', result);
      res.status(200).json({ message: 'Assignment created successfully', result }); // Return success message
    } catch (error: any) {
      console.error('Error in createAssignment:', error); // Log the error to the console
      res.status(500).json({ 
        // Return error message with details
        message: 'An error occurred while creating the assignment', 
        error: error.message,
        stack: error.stack
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' }); // Return error if method is not POST
  }
}