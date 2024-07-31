// pages/api/groups/[assignmentID].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getReviewGroups, getStudentSubmissions, getGroupDetails } from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assignmentID } = req.query;

  try {
    const submissions = await getStudentSubmissions(Number(assignmentID));

    let allGroups = [];
    for (const sub of submissions) {
      const groups = await getReviewGroups(sub.studentID, Number(assignmentID), undefined, undefined);
      if (groups.length > 0) {
        allGroups.push(groups);
      }
    }

    if (allGroups.length > 0) {
      // Flatten the array of groups into a single array for details fetching
      const flattenedGroups = allGroups.flat();
      const detailedGroups = await getGroupDetails(flattenedGroups);

      // Reconstruct the groups back to the original nested structure
      let groupedDetails = [];
      for (let group of allGroups) {
        let groupDetails = detailedGroups.filter(detail =>
          group.some((g: any) => g.studentID === detail.studentID && g.submissionID === detail.submissionID)
        );
        groupedDetails.push(groupDetails);
      }

      res.status(200).json({ groups: groupedDetails });
    } else {
      res.status(404).json({ error: 'No review groups found' });
    }
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
