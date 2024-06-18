import { NextRequest } from 'next/server';
import { updateSessionInMiddleware } from './src/lib';

export async function middleware(request: NextRequest) {
  return await updateSessionInMiddleware(request);
}
