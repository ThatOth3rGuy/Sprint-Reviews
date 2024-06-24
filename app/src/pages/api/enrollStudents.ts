import { NextApiRequest, NextApiResponse } from 'next';
import { enrollStudent } from '../../db';

// This function handles adding student to database under given courseID
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { studentIDs, courseID } = req.body;
        console.log('Enrolling students', studentIDs, 'in course', courseID);
        try {
            for (const studentId of studentIDs) {
                console.log('Enrolling student', studentId, 'in course', courseID);
                await enrollStudent(studentId, courseID);
            }
            res.status(201).json({ courseID, studentIDs });
        } catch (error) {
            res.status(500).json({ error: 'Failed to enroll student in ', courseID });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}