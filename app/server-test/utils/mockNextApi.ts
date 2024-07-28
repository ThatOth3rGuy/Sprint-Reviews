import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, RequestMethod } from 'node-mocks-http';

export function mockNextApi(method: RequestMethod, body: any = {}) {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method,
    body,
  });

  // Add any necessary properties to match the NextApiRequest type
  req.query = {};
  req.cookies = {};
  req.headers = {};
  req.env = process.env;

  return { req, res };
}
