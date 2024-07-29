import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userID } = req.body;
    try {
      const courses = await getNotificationsForStudent(Number(userID));
      res.status(200).json({ courses });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
async function getNotificationsForStudent(userID: number) {
  const sql = `
      SELECT n.*, s.userID from student_notifications n join student s on n.studentID=s.studentID
      where userID =?
    `;
  try {
    const results = await query(sql, [userID]);
    return results;
  } catch (error) {
    console.error("Error in getNotificationsForStudent:", error);
    throw error;
  }
}
