import { NextApiRequest, NextApiResponse } from 'next';
import { enrollStudent } from '../../../db';

// This function handles adding students to the database under a given courseID
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { studentIDs, courseID } = req.body;

        try {
            for (const userID of studentIDs) {
                await enrollStudent(userID, courseID);
            }
            res.status(201).json({ courseID, studentIDs });
        } catch (error) {
            const err = error as Error;
            console.error('Failed to enroll student in course:', courseID, 'Error:', err.message);
            res.status(500).json({ error: `Failed to enroll students in course ${courseID}`, details: err.message });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
