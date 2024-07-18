/*
* This API call is used to create randomized groups.
* It will take an int as the number of students per group, and an array of student IDs.
* It then calls the randomization function to create the groups, before calling the database query to add them.
*/

// /pages/api/createNew/createGroups.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createGroups } from '../../../db';

// randomizeGroups function takes an array of student IDs and a group size, 
// then returns an array of groups with each group containing the specified student IDs.
const randomizeGroups = (students: number[], groupSize: number) => {
  const shuffledStudents = students.sort(() => Math.random() - 0.5);
  const groups = [];
  for (let i = 0; i < shuffledStudents.length; i += groupSize) {
    groups.push(shuffledStudents.slice(i, i + groupSize));
  }
  return groups;
};
/* 
* Currently this function sets the remainder of students that don't fit into a group as their own group.
* This should be modified to allow for a more even distribution of students. As an example,
* if there are 10 students and 3 students per group, the function will result in 3 groups of 3 students 
* and 1 group of 1 student.
* It could also be left as is, as long as there's a way to manually adjust groups later.
*/

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { groupSize, studentIds } = req.body;

  if (!groupSize || !Array.isArray(studentIds) || studentIds.length === 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const groups = randomizeGroups(studentIds, groupSize);

    await createGroups(groups);

    res.status(201).json({ message: 'Groups created successfully', groups });
  } catch (error) {
    res.status(500).json({ error: 'Error creating groups', details: (error as Error).message });
  }
};

export default handler;
