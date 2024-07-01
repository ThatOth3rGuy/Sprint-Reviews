import { NextApiRequest, NextApiResponse } from 'next';
import { assignStudent } from '../../db';

// This function handles adding students to the database under a given courseID
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { studentIDs, assignmentID } = req.body;

        try {
            for (const userID of studentIDs) {
                await assignStudent(userID, assignmentID);
            }
            res.status(201).json({ assignmentID, studentIDs });
        } catch (error) {
            const err = error as Error;
            console.error('Failed to assign student to assignment:', assignmentID, 'Error:', err.message);
            res.status(500).json({ error: `Failed to assign student to assignment: ${assignmentID}`, details: err.message });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}