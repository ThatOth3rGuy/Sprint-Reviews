// pages/api/submissions/[assignmentID]/group-students.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { assignmentID } = req.query;

    if (!assignmentID) {
        return res.status(400).json({ error: 'Missing assignmentID' });
    }

    try {
        const submittedGroups = await getSubmittedGroups(Number(assignmentID));
        const remainingGroups = await getRemainingGroups(Number(assignmentID));
        console.log('Fetched group students:', submittedGroups, remainingGroups);
        return res.json({ submittedEntities: submittedGroups, remainingEntities: remainingGroups });
    } catch (error) {
        console.error('Error fetching group students:', error);
        return res.status(500).json({ error: 'Error fetching group students' });
    }
}

async function getSubmittedGroups(assignmentID: number): Promise<{ groupName: string, fileName: string }[]> {
    const sql = `
        SELECT cg.groupID, GROUP_CONCAT(CONCAT(u.firstName, ' ', u.lastName) SEPARATOR ', ') AS groupName, s.fileName 
        FROM submission s 
        JOIN student st ON s.studentID = st.studentID 
        JOIN user u ON st.userID = u.userID 
        JOIN course_groups cg ON st.studentID = cg.studentID
        WHERE s.assignmentID = ?
        GROUP BY cg.groupID, s.fileName
    `;
    try {
        const rows = await query(sql, [assignmentID]);
        return rows.map((row: any) => ({
            name: row.groupName,
            fileName: row.fileName
        }));
    } catch (error) {
        console.error('Error in getSubmittedGroups:', error);
        throw error;
    }
}

async function getRemainingGroups(assignmentID: number): Promise<string[]> {
    const sql = `
        SELECT cg.groupID, GROUP_CONCAT(CONCAT(u.firstName, ' ', u.lastName) SEPARATOR ', ') AS groupName 
        FROM student st
        JOIN user u ON st.userID = u.userID
        JOIN course_groups cg ON st.studentID = cg.studentID
        LEFT JOIN submission s ON st.studentID = s.studentID AND s.assignmentID = ?
        WHERE s.submissionID IS NULL
        GROUP BY cg.groupID
    `;
    try {
        const rows = await query(sql, [assignmentID]);
        return rows.map((row: any) => row.groupName);
    } catch (error) {
        console.error('Error in getRemainingGroups:', error);
        throw error;
    }
}
