import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userID } = req.query;
    try {
      const notifications = await fetchNotificationsFromDB(Number(userID));
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

async function fetchNotificationsFromDB(userID: number) {
  const sql = `
      SELECT n.*, s.userID from student_notifications n join student s on n.studentID=s.studentID
      where userID = ?
    `;
  try {
    const results = await query(sql, [userID]);
    return results[0]; // Return the first (and should be only) result
  } catch (error) {
    console.error("Error in fetchNotificationsFromDB:", error);
    throw error;
  }
}