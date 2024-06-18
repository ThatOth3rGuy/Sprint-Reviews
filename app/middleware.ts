// This file is used to update the session each time a request on the app is made
import { NextRequest } from 'next/server';
import { updateSessionInMiddleware } from './src/lib';

console.log("Middleware is running");

export async function middleware(request: NextRequest) {
  return await updateSessionInMiddleware(request);
}
