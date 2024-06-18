import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../lib';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession(req);
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;
