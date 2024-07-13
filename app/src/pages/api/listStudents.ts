import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { parse } from 'csv-parse';
import { getStudentsById, getStudentsByName } from '../../db';
import formidable, { IncomingForm } from 'formidable';

//const upload = multer({ dest: 'studentList/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

// Define the API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   //***This function exports all students to a CSV file for testing purposes***
   // try {
   //    // Get all students from the database
   //    const students = await query('SELECT * FROM user WHERE userRole = "student"');

   //    // Convert students array to CSV format
   //    const csvData = students.map((student: any) => {
   //       return `${student.firstName},${student.lastName}`;
   //    }).join('\n');

   //    // Write CSV data to a file
   //    const filePath = '/students.csv';
   //    fs.writeFileSync(filePath, csvData);

   //    // Respond with the file path
   //    res.status(200).json({ message: 'Students exported successfully', filePath });
   // } catch (error) {
   //    console.error(error);
   //    res.status(500).json({ error: 'Error exporting students to CSV' });
   // }

   //***This function imports students from a CSV file and retrieves their details from the database***
   // Parse csv file uploaded and find database matches
   const form = new IncomingForm();
   form.parse(req, async (err, fields, files) => {
   if (err) {
      return res.status(500).json({ message: 'Error uploading file', error: err.message });
   }
   if (!files || !files.file) {
      return res.status(400).json({ message: 'No file uploaded' });
   }
   const filePath = files.file[0].filepath;
   
   const studentsDetails: any[] = [];
   fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on('data', (data: any) => {
         studentsDetails.push(data);
      })
      .on('end', async () => {
         try {
            // Loop through each student and call getStudents
            const students = [];
            for (const studentDetail of studentsDetails) {
               const studentData = await getStudentsByName(studentDetail.firstName, studentDetail.lastName);
               students.push(studentData);
            }
            // Respond with the retrieved students
            res.status(200).json({ message: 'Students retrieved successfully', students, showInPopup: true});
         } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error retrieving students from database' });
         }
      });
   });
}