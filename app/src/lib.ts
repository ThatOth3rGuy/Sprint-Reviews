// This is the main file for creating/updating session data to check the user's state and role
import { SignJWT, jwtVerify } from 'jose';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { query } from './db';
import bcrypt from 'bcrypt';


// Take the secret key from the .env file, if it doesn't exist default to 'secret'
const secretKey = process.env.SECRET_KEY || 'secret';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expires.getTime())
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

// This function is used to create a session for the user during the login process
export async function login({ email, password, role }: { email: string; password: string, role: string }, res: NextApiResponse) {

  // Query the database for the user information
  const result = await query('SELECT userID, pwd FROM user WHERE email = ?', [email]);
  const user = result[0];
  console.log("user: ", user);

  if (!user) {
    throw new Error('User not found');
  }

  // Compare the provided password with the hashed password
  const match = await bcrypt.compare(password, user.pwd);

  if (!match) {
    throw new Error('Incorrect password');
  }

  const userID = user.userID; // Retrieve the userID from the query result
  const userSession = { email, role, userID }; // Include the userID in the user session object
  const expires = new Date(Date.now() + 10 * 60 * 1000); // Each session expires in 10 minutes
  const session = await encrypt({ user: userSession, expires });

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('session', session, {
      httpOnly: true,
      expires,
      path: '/',
    })
  );
}

// Remove the current session data
export async function logout(res: NextApiResponse) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('session', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    })
  );
}

// Returns session data if it exists
export async function getSession(req: NextApiRequest): Promise<any> {
  const cookies = req.headers?.cookie ? cookie.parse(req.headers.cookie) : {};
  const session = cookies.session;
  if (!session) return null;

  // Check if the session has expired
  const parsed = await decrypt(session);
  if (new Date(parsed.expires) < new Date()) {
    throw new Error('Session has expired');
  }

  return await decrypt(session);
}

// Update the session data
export async function updateSession(req: NextApiRequest, res: NextApiResponse) {
  const cookies = req.headers?.cookie ? cookie.parse(req.headers.cookie) : {};
  const session = cookies.session;
  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 60 * 1000); // Session expires in 10 minutes
  const updatedSession = await encrypt(parsed);

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('session', updatedSession, {
      httpOnly: true,
      expires: parsed.expires,
      path: '/',
    })
  );
}

// Update the session date (this function is called each time any request is made)
export async function updateSessionInMiddleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  if (!sessionCookie) return NextResponse.next();

  const parsed = await decrypt(sessionCookie);
  parsed.expires = new Date(Date.now() + 10 * 60 * 1000); // Session expires in 10 minutes
  const updatedSession = await encrypt(parsed);

  const response = NextResponse.next();
  response.cookies.set('session', updatedSession, {
    httpOnly: true,
    expires: parsed.expires,
    path: '/',
  });

  return response;
}
