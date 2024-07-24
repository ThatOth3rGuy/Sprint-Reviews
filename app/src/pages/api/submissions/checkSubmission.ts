// // pages/api/submissions/checkSubmission.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { assignmentID, userID } = req.query;

    if (!assignmentID || !userID) {
        return res.status(400).json({ error: 'Missing assignmentID or userID' });
    }

    try {
        const result = await checkSubmission(Number(assignmentID), Number(userID));
        return res.json(result);
    } catch (error) {
        console.error('Error checking submission status:', error);
        return res.status(500).json({ error: 'Error checking submission status' });
    }
}

async function checkSubmission(assignmentID: number, userID: number): Promise<{ isSubmitted: boolean, submissionDate: string | null, submissionID: number | null, fileName: string | null }> {
    const sql = `
        SELECT s.*, st.studentID, st.userID, a.deadline 
        FROM submission s 
        JOIN student st ON s.studentID = st.studentID 
        JOIN assignment a ON s.assignmentID = a.assignmentID
        WHERE s.assignmentID = ? AND st.userID = ?
    `;
    try {
        const rows = await query(sql, [assignmentID, userID]);
        if (rows.length > 0) {
            const submissionDate = new Date(rows[0].submissionDate);
            const deadlineDate = new Date(rows[0].deadline);
            const isLate = submissionDate > deadlineDate;
            return { 
                isSubmitted: true, 
                submissionDate: submissionDate.toISOString(), 
                submissionID: rows[0].submissionID, 
                fileName: rows[0].fileName,
                isLate
            };
        } else {
            return { isSubmitted: false, submissionDate: null, submissionID: null, fileName: null, isLate: false };
        }
    } catch (error) {
        console.error('Error in checkSubmission:', error);
        throw error;
    }
}