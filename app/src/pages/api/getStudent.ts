import { NextApiRequest, NextApiResponse } from 'next';
import { getStudents } from '../../db';

// This function handles adding students to the database under a given courseID
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { studentIDs } = req.body;

        try {
            for (const userID of studentIDs) {
                await getStudents(userID);
            }
            res.status(201).json({ studentIDs });
        } catch (error) {
            const err = error as Error;
            console.error('Failed to find student:', studentIDs, 'Error:', err.message);
            res.status(500).json({ error: `Failed to assign student to assignment: ${studentIDs}`, details: err.message });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}