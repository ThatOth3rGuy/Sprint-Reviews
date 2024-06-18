import { SignJWT, jwtVerify } from 'jose';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.SECRET_KEY || 'secret';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10s')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login({ email, password, role }: { email: string; password: string; role: string }, res: NextApiResponse) {
  const user = { email, name: 'John', role };
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await encrypt({ user, expires });

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('session', session, {
      httpOnly: true,
      expires,
      path: '/',
    })
  );
}

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

export async function getSession(req: NextApiRequest): Promise<any> {
  const cookies = req.headers?.cookie ? cookie.parse(req.headers.cookie) : {};
  const session = cookies.session;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(req: NextApiRequest, res: NextApiResponse) {
  const cookies = req.headers?.cookie ? cookie.parse(req.headers.cookie) : {};
  const session = cookies.session;
  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
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

export async function updateSessionInMiddleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  if (!sessionCookie) return NextResponse.next();

  const parsed = await decrypt(sessionCookie);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const updatedSession = await encrypt(parsed);

  const response = NextResponse.next();
  response.cookies.set('session', updatedSession, {
    httpOnly: true,
    expires: parsed.expires,
    path: '/',
  });

  return response;
}
