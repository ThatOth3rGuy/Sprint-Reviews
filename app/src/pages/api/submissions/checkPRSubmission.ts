// pages/api/submissions/checkSubmission.ts
import { NextApiRequest, NextApiResponse } from "next";
import { query, getStudentsById } from "../../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { assignmentID, userID } = req.query;

  if (!assignmentID || !userID) {
    return res.status(400).json({ error: "Missing assignmentID or userID" });
  }
//   const studentID = await getStudentsById(Number(userID));
//   console.log("Student id", studentID);
  try {
    console.log(
      "Checking submission status for assignment",
      assignmentID,
      "and user",
      userID
    );
    const revieweeID = await getRevieweeID(Number(userID), Number(assignmentID));
    const result = await checkSubmission(
      Number(assignmentID),
      Number(revieweeID)
    );
    console.log("Review id", revieweeID);
    console.log("Submission status:", result);

    return res.json(result);
  } catch (error) {
    console.error("Error checking submission status:", error);
    return res.status(500).json({ error: "Error checking submission status" });
  }
}

async function checkSubmission(
  assignmentID: number,
  studentID: number
): Promise<{
  isSubmitted: boolean;
  submissionDate: string | null;
  submissionID: number | null;
  assignmentID: number | null;
  fileName: string | null;
  studentName: string | null;
  studentID: number | null;
  isLate: boolean;
  isLink: boolean;
}> {
  const sql = `
  SELECT CONCAT(u.firstName, ' ', u.lastName) AS studentName, s.*
FROM submission s
JOIN student st ON s.studentID = st.studentID
JOIN user u ON st.userID = u.userID
WHERE s.assignmentID = ? AND s.studentID = ?;
  `;
  try {
    const rows = await query(sql, [assignmentID, studentID]);
    console.log(rows);
    if (rows.length > 0) {
      const submissionDate = new Date(rows[0].submissionDate);
      console.log("submission date", submissionDate);
      const deadlineDate = new Date(rows[0].deadline);
      console.log("deadline", deadlineDate);
      const isLate = submissionDate > deadlineDate;
      const isLink = rows[0].fileType === "link";
      return {
        isSubmitted: true,
        submissionDate: submissionDate.toISOString(),
        submissionID: rows[0].submissionID,
        assignmentID: rows[0].assignmentID,
        fileName: rows[0].fileName,
        studentName: rows[0].studentName,
        studentID: rows[0].studentID,
        isLate,
        isLink,
      };
    } else {
      return {
        isSubmitted: false,
        submissionDate: null,
        submissionID: null,
        assignmentID: null,
        fileName: null,
        studentName: null,
        studentID: null,
        isLate: false,
        isLink: false,
      };
    }
  } catch (error) {
    console.error("Error in checkSubmission:", error);
    throw error;
  }
}

async function getRevieweeID(
  userID: number, assignmentID: number
): Promise<{ studentID: number, assignmentID: number }> {
  const sql = "SELECT r.revieweeID, r.assignmentID, s.studentID, s.userID FROM review_groups r join student s on s.studentID= r.studentID WHERE userID = ? and assignmentID= ?";
  try {
    const rows = await query(sql, [userID, assignmentID]);
    const revieweeIDs = rows.map((row: { revieweeID: any }) => row.revieweeID);
    return revieweeIDs;
  } catch (error) {
    console.error("Error in getRevieweeID:", error);
    throw error;
  }
}
