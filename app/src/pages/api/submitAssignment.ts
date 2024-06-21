import type { NextApiRequest, NextApiResponse } from 'next';
import { submitAssignment } from '../../db';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error parsing form' });
      }

      const file = files.file as unknown as formidable.File;
      const assignmentID = fields.assignmentID as unknown as string;

      if (!file || !assignmentID) {
        return res.status(400).json({ error: 'Missing file or assignmentID' });
      }

      try {
        const fileContent = await fs.promises.readFile(file.filepath);
        await submitAssignment(parseInt(assignmentID), 1, fileContent); // Assuming studentID is 1 for now
        res.status(200).json({ message: 'Assignment submitted successfully' });
      } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({ error: 'Error submitting assignment' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}