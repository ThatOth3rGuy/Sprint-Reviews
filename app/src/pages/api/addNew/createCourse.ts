// pages/api/addNew/createCourse.ts

/*
  This API endpoint is used to create a new course in the database. The endpoint is accessed through a POST request to /api/addNew/createCourse.
  The request body must contain the courseName and instructorID. The instructorID is used to get the instructorID from the userID.
  The courseName and instructorID are then used to create a new course in the database. This is only used by instructors to create new courses.
  Was intended to also handle creating a course if no students were passed in the request. That enrollment is handled in the course dashboard page, and called 
  from the enrollStudent.ts API endpoint.
*/
import { NextApiRequest, NextApiResponse } from 'next';
import { createCourse, getInstructorID } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Get the courseName and instructorID from the request body
    const { courseName, instructorID: userID, missingData } = req.body;
    console.log('Received request body:', req.body);

    if (!courseName) {
      return res.status(400).json({ error: 'Missing courseName' }); // Return error if courseName is missing
    }
    if (!userID) {
      return res.status(400).json({ error: 'Missing userID' }); // Return error if userID is missing
    }

    try {
      // Get the instructorID from the userID
      const instructorID = await getInstructorID(userID);
      
      if (!instructorID) {
        return res.status(400).json({ error: 'Invalid userID or user is not an instructor' }); // Return error if instructorID is not found
      }

      const courseId = await createCourse(courseName, instructorID); // Create the course with the courseName and instructorID and return the courseID
      res.status(201).json({ courseId }); // Return the courseID of the newly created course for state management
    } catch (error) {
      console.error('Error creating course:', error); // Log the error to the console
      res.status(500).json({ error: 'Failed to create course', details: (error as Error).message });  // Return error message with details
    } 
  } else {
    res.status(405).end(); // Method Not Allowed if request method is not POST
  }
}