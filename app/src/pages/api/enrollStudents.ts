// api/enrollStudents.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { enrollStudent, getCourse } from '../../db';
import fs from 'fs';
import path from 'path';

// This function handles adding students to the database under a given courseID
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    const { studentIDs, courseID, missingData } = req.body;
    const missingStudents: number[] = missingData ? missingData.map(Number) : [];
    let courseName: string = '';

    try {
        for (const userID of studentIDs) {
            try {
                await enrollStudent(userID.toString(), courseID.toString());
                console.log(`Enrolled student: ${userID} in course: ${courseID}`);
            } catch (error) {
                console.error(`Failed to enroll student: ${userID} in course: ${courseID}. Error:`, (error as Error).message);
                missingStudents.push(userID);
            }
        }

        if (missingStudents.length > 0) {
            // Create a CSV file with missing student IDs
            courseName = (await getCourse(courseID))?.courseName;
            const missingStudentsCSV = ['studentID', ...missingStudents].join('\n');
            const missingDataFilePath = path.join(process.cwd(), 'public', `${courseName}_missingStudents.csv.csv`);
            fs.writeFileSync(missingDataFilePath, missingStudentsCSV);
        }

        res.status(201).json({ 
            courseID, 
            studentIDs, 
            missingStudentsFilePath: missingStudents.length > 0 ? `/public/${courseName}_missingStudents.csv` : null 
        });
    } catch (error) {
        console.error(`Failed to enroll students in course: ${courseID}. Error:`, (error as Error).message);
        res.status(500).json({ 
            error: `Failed to enroll students in course ${courseID}`, 
            details: (error as Error).message 
        });
    }
}
