// pages/api/submissions/[assignmentID]/students.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { assignmentID } = req.query;

    if (!assignmentID) {
        return res.status(400).json({ error: 'Missing assignmentID' });
    }

    try {
        const submittedStudents = await getSubmittedStudents(Number(assignmentID));
        const remainingStudents = await getRemainingStudents(Number(assignmentID));
        return res.json({ submittedStudents, remainingStudents });
    } catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({ error: 'Error fetching students' });
    }
}

async function getSubmittedStudents(assignmentID: number): Promise<{ name: string, fileName: string }[]> {
    const sql = `
        SELECT CONCAT(u.firstName, ' ', u.lastName) AS name, s.fileName 
        FROM submission s 
        JOIN student st ON s.studentID = st.studentID 
        JOIN user u ON st.userID = u.userID 
        WHERE s.assignmentID = ?
    `;
    try {
        const rows = await query(sql, [assignmentID]);
        return rows.map((row: any) => ({
            name: row.name,
            fileName: row.fileName
        }));
    } catch (error) {
        console.error('Error in getSubmittedStudents:', error);
        throw error;
    }
}

async function getRemainingStudents(assignmentID: number): Promise<string[]> {
    const sql = `
        SELECT CONCAT(u.firstName, ' ', u.lastName) AS name 
        FROM student st
        JOIN user u ON st.userID = u.userID
        LEFT JOIN submission s ON st.studentID = s.studentID AND s.assignmentID = ?
        WHERE s.submissionID IS NULL
    `;
    try {
        const rows = await query(sql, [assignmentID]);
        return rows.map((row: any) => row.name);
    } catch (error) {
        console.error('Error in getRemainingStudents:', error);
        throw error;
    }
}
