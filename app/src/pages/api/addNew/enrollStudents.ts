// This file is responsible for handling the POST request to enroll students in a course.
// The request body must contain the studentIDs, courseID, and missingData.
// The studentIDs array contains the student IDs to be enrolled in the course, which is parsed in the frontend and sent as an array of studentIDs via csv upload.
// This is used in the course dashboard page to enroll students in a course, as an extension of course creation.

import { NextApiRequest, NextApiResponse } from 'next';
import { enrollStudent } from '../../../db';
import fs from 'fs'; // File system module
import path from 'path'; // Path module

// This function handles adding students to the database under a given courseID
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' }); // Return error if method is not POST
  }
  // Get the studentIDs, courseID, and missingData from the request body
  const { studentIDs, courseID, missingData } = req.body;
  const missingStudents: number[] = missingData ? missingData.map(Number) : []; // Array to store missing students not currently registered in the application database.

  if (!Array.isArray(studentIDs) || studentIDs.length === 0) { // Check if studentIDs is an array and not empty
    return res.status(400).json({ error: 'Invalid studentIDs array' });
  }

  // Enrolling an individual student
  if (studentIDs.length <= 1) {
    try {
      await enrollStudent(studentIDs.toString(), courseID.toString()); // Enroll the student in the course using the enrollStudent function from the db file
      return res.status(201).json({ courseID, studentIDs }); // Return success message with courseID and studentIDs
    } catch (error) {
      const err = error as any; // Cast error to any type
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(405).json({ error: `Student ${studentIDs} is already enrolled in course ${courseID}` }); // Return error if student is already enrolled
      } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: `Student ${studentIDs} does not exist in the database` }); // Return error if student does not exist
      } else {
        console.error(`Failed to enroll student: ${studentIDs} in course: ${courseID}. Error:`, err.message); // Log the error to the console
        return res.status(500).json({ error: `Failed to enroll student ${studentIDs}`, details: err.message }); // Return error message with details
      }
    }
  }

  // Enrolling a list of students from a .csv file 
  try {
    console.log("Enrolling students:", studentIDs); // Log the studentIDs to be enrolled
    for (const userID of studentIDs) { // Iterate over the studentIDs array
      try {
        await enrollStudent(userID.toString(), courseID.toString()); // Enroll the student in the course using the enrollStudent function from the db file
        console.log(`Enrolled student: ${userID} in course: ${courseID}`); // Log the successful enrollment
      } catch (error) {
        const err = error as any; // Cast error to any type
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`Student ${userID} is already enrolled in course ${courseID}`); // Log if student is already enrolled
        } else {
          console.error(`Failed to enroll student: ${userID} in course: ${courseID}. Error:`, err.message); // Log the error to the console
          missingStudents.push(userID);
        }
      }
    }
    // If there are missing students, create a CSV file with the missing student IDs to inform the user of students not currently registered in the application database.
    // Any missing students will need to be enrolled manually. As the application only supports enrolling students that are already registered.
    if (missingStudents.length > 0) { // Check if there are missing students
      const missingStudentsCSV = ['studentID', ...missingStudents].join('\n');  // Create a CSV file with the missing student IDs
      const missingDataFilePath = path.join(process.cwd(), 'public', `course${courseID}_missingStudents.csv`); // Path to store the missing students CSV file
      fs.writeFileSync(missingDataFilePath, missingStudentsCSV); // Write the missing students CSV file
    }
    // Return success message with courseID, studentIDs, and missingStudentsFilePath
    return res.status(201).json({
      courseID,
      studentIDs,
      missingStudentsFilePath: missingStudents.length > 0 ? `/public/course${courseID}_missingStudents.csv` : null
    });
  } catch (error) {
    console.error(`Critical error: Failed to enroll students in course: ${courseID}. Error:`, (error as Error).message); // Log the error to the console
    return res.status(500).json({ // Return error message with details
      error: `Failed to enroll students in course ${courseID}`,
      details: (error as Error).message 
    });
  }
}
