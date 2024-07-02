// // pages/api/setUniqueDueDate.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { setUniqueDueDates } from '../../db';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const { assignmentID, studentIDs, dueDate } = req.body;

//       const result = await setUniqueDueDates(assignmentID, studentIDs, dueDate);

//       res.status(200).json(result);
//     } catch (error) {
//       console.error('Error setting unique due dates:', error);
//       res.status(500).json({ message: 'Error setting unique due dates' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }