import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const assignments = await getAssignmentsWithSubmissions();
      res.status(200).json(assignments);
    } catch (error: any) {
      console.error('Error fetching assignments with submissions:', error);
      res.status(500).json({ 
        message: 'An error occurred while fetching assignments with submissions',
        error: error.message || 'Unknown error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
export async function getAssignmentsWithSubmissions() {
  const sql = `
    SELECT 
      a.assignmentID, 
      a.title, 
      a.description, 
      DATE_FORMAT(a.deadline, '%Y-%m-%dT%H:%i:%s.000Z') as deadline,
      a.rubric,
      a.file,
      s.studentID,
      DATE_FORMAT(s.submissionDate, '%Y-%m-%dT%H:%i:%s.000Z') as submissionDate,
      s.file as submissionFile
    FROM 
      assignment a
    LEFT JOIN 
      submissions s ON a.assignmentID = s.assignmentID
  `;
  try {
    const rows = await query(sql);
    
    // Group submissions by assignment
    const assignments = rows.reduce((acc: { assignmentID: any; title: any; description: any; deadline: any; rubric: any; file: any; submissions: { studentID: any; submissionDate: any; file: any; }[]; }[], row: { assignmentID: any; studentID: any; submissionDate: any; submissionFile: any; title: any; description: any; deadline: any; rubric: any; file: any; }) => {
      const assignment = acc.find((a: { assignmentID: any; }) => a.assignmentID === row.assignmentID);
      if (assignment) {
        if (row.studentID) {
          assignment.submissions.push({
            studentID: row.studentID,
            submissionDate: row.submissionDate,
            file: row.submissionFile
          });
        }
      } else {
        acc.push({
          assignmentID: row.assignmentID,
          title: row.title,
          description: row.description,
          deadline: row.deadline,
          rubric: row.rubric,
          file: row.file,
          submissions: row.studentID ? [{
            studentID: row.studentID,
            submissionDate: row.submissionDate,
            file: row.submissionFile
          }] : []
        });
      }
      return acc;
    }, []);

    return assignments;
  } catch (error) {
    console.error('Error in getAssignmentsWithSubmissions:', error);
  }
}