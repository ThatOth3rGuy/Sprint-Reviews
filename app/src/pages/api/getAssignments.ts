import type { NextApiRequest, NextApiResponse } from 'next'
import { getAssignments } from '../../db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const assignments = await getAssignments()
      res.status(200).json(assignments)
    } catch (error) {
      console.error('Error fetching assignments:', error)
      res.status(500).json({ error: 'Failed to fetch assignments' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}