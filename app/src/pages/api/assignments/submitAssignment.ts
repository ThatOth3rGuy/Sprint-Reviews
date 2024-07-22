// // pages/api/submitAssignment.ts
// import type { NextApiRequest, NextApiResponse } from 'next'
// import multer from 'multer';
// import { submitAssignment } from '../../../db'; 

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const upload = multer({ dest: '/tmp' });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const multerMiddleware = upload.single('file');

//   multerMiddleware(req as any, res as any, async (err) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error uploading file' });
//     }

//     const file = (req as any).file;
//     const { assignmentID, studentID } = req.body;

//     try {
//       const result = await submitAssignment(parseInt(assignmentID), parseInt(studentID), file);
//       res.status(200).json(result);
//     } catch (error) {
//       console.error('Error submitting assignment:', error);
//       res.status(500).json({ message: 'Error submitting assignment' });
//     }
//   });
// }

// pages/api/submitAssignment.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer';
import fs from 'fs/promises';
import { query } from '../../../db';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ dest: '/tmp' });

async function submitAssignment(assignmentID: number, studentID: number, file: Express.Multer.File) {
  
  const studentIdSQL = `SELECT studentID FROM student WHERE userID = ?`;

  const sql = `
    INSERT INTO submission (assignmentID, studentID, fileName, fileContent, fileType, submissionDate)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  try {
    const fileContent = await fs.readFile(file.path);
    const fileName = file.originalname;
    const fileType = file.mimetype;

    //Convert userID to studentID
    const studentIDResult = await query(studentIdSQL, [studentID]);
    const userID = parseInt(studentIDResult[0].studentID);

    await query(sql, [assignmentID, userID, fileName, fileContent, fileType]);

    // Delete the temporary file after it's been saved to the database
    await fs.unlink(file.path);

    return { success: true, message: 'Assignment submitted successfully' };
  } catch (error) {
    console.error('Error in submitAssignment:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const multerMiddleware = upload.single('file');

  multerMiddleware(req as any, res as any, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file' });
    }

    const file = (req as any).file;
    const { assignmentID, studentID } = req.body;

    try {
      const result = await submitAssignment(parseInt(assignmentID), parseInt(studentID), file);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      res.status(500).json({ message: 'Error submitting assignment' });
    }
  });
}