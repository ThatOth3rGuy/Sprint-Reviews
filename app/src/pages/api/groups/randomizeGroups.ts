/*
* This API call is used to create randomized groups.
* It will take an int as the number of students per group, an array of student IDs, as well as a courseID.
* It then calls the randomization function to create the groups and returns them as arrays.
*/

// /pages/api/createNew/randomizeGroups.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// randomizeGroups function takes an array of student IDs and a group size, 
// then returns an array of groups with each group containing the specified student IDs.
/* e.g.
* randomizeGroups([1, 2, 3, 4, 5], 2) => [[1, 2], [3, 4], [5]]
*/
const randomizeGroups = (students: number[], groupSize: number): number[][] => {
  // Shuffle the student array
  const shuffledStudents = students.sort(() => Math.random() - 0.5);

  // Calculate the number of groups needed
  const numberOfGroups = Math.ceil(shuffledStudents.length / groupSize);

  // Create an array to hold the groups
  const groups: number[][] = Array.from({ length: numberOfGroups }, () => []);

  // Distribute students to groups as evenly as possible
  shuffledStudents.forEach((student, index) => {
    groups[index % numberOfGroups].push(student);
  });

  return groups;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { groupSize, studentIds } = req.body;

  // Error handling
  if (!groupSize || !Array.isArray(studentIds) || studentIds.length === 0) {
    return res.status(400).json({ error: 'Invalid request. Ensure there are students enrolled in this course.' });
  }
  if (groupSize > studentIds.length) {
    return res.status(400).json({ error: 'Group size is larger than the number of students' });
  }

  try {
    const groups = randomizeGroups(studentIds, groupSize);

    res.status(201).json({ message: 'Groups created successfully', groups });
  } catch (error) {
    res.status(500).json({ error: 'Error creating groups', details: (error as Error).message });
  }
};

export default handler;
