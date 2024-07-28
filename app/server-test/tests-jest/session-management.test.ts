import { encrypt, decrypt, login, logout, getSession, updateSession, updateSessionInMiddleware } from '../../src/lib';
import { SignJWT, jwtVerify } from 'jose';
import * as cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../src/db';

jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('encryptedToken')
  })),
  jwtVerify: jest.fn()
}));

jest.mock('cookie', () => ({
  serialize: jest.fn(),
  parse: jest.fn()
}));

jest.mock('../../src/db', () => ({
  query: jest.fn()
}));

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn().mockReturnValue({
      cookies: {
        set: jest.fn()
      }
    })
  }
}));

describe('Session Management', () => {
  const secretKey = process.env.SECRET_KEY || 'secret';
  const key = new TextEncoder().encode(secretKey);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('encrypt', () => {
    it('should encrypt the payload', async () => {
      // Create new payload
      const payload = { user: { email: 'test@test.com', role: 'admin', userID: 1 }, expires: new Date() };

      // Call encrypt function
      const result = await encrypt(payload);

      // Check if SignJWT was called with the payload, and the result is the encrypted token
      expect(SignJWT).toHaveBeenCalledWith(payload);
      expect(result).toBe('encryptedToken');
    });
  });

  describe('decrypt', () => {
    it('should decrypt the token', async () => {
      // Create new token and payload
      const token = 'encryptedToken';
      const payload = { user: { email: 'test@test.com', role: 'admin', userID: 1 }, expires: new Date() };
      // Mock jwtVerify to return the payload
      (jwtVerify as jest.Mock).mockResolvedValue({ payload });

      // Call decrypt function
      const result = await decrypt(token);

      // Check if jwtVerify was called with the token, key, and the result is the payload
      expect(jwtVerify).toHaveBeenCalledWith(token, key, { algorithms: ['HS256'] });
      expect(result).toEqual(payload);
    });
  });

  describe('login', () => {
    it('should set session cookie on successful login', async () => {
      // Create new request and response objects, with mocked query
      const req = { email: 'test@test.com', password: 'password', role: 'admin' };
      const res = { setHeader: jest.fn() } as unknown as NextApiResponse;
      const userID = 1;
      (query as jest.Mock).mockResolvedValue([{ userID }]);
      const expires = new Date(Date.now() + 10 * 60 * 1000);

      // Mocked cookie serialize to return the cookie string
      (cookie.serialize as jest.Mock).mockReturnValue('session=encryptedToken; Path=/; HttpOnly; Expires=' + expires.toUTCString());

      await login(req, res);

      // Check if query was called with the email and password, and if cookie serialize was called with the correct parameters
      expect(query).toHaveBeenCalledWith('SELECT userID FROM user WHERE email = ? AND pwd = ?', [req.email, req.password]);
      expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', expect.any(String));
      expect(cookie.serialize).toHaveBeenCalledWith('session', 'encryptedToken', {
        httpOnly: true,
        expires: expect.any(Date), // Use any Date as actual date is sometimes off by a few milliseconds
        path: '/'
      });
    });

    it('should throw an error if user not found', async () => {
      // Create new request and response objects, with mocked query
      const req = { email: 'test@test.com', password: 'wrongpassword', role: 'admin' };
      const res = { setHeader: jest.fn() } as unknown as NextApiResponse;
      (query as jest.Mock).mockResolvedValue([]);

      // Check if login function throws an error if user not
      await expect(login(req, res)).rejects.toThrow('User not found');
    });
  });

  describe('logout', () => {
    it('should clear the session cookie', async () => {
      // Create new response object and mock cookie serialize to return the cleared cookie string
      const res = { setHeader: jest.fn() } as unknown as NextApiResponse;
      (cookie.serialize as jest.Mock).mockReturnValue('session=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT');

      await logout(res);

      // Check if cookie serialize was called with the correct parameters, and the session cookie was cleared
      expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', expect.any(String));
      expect(cookie.serialize).toHaveBeenCalledWith('session', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
      });
    });
  });

  describe('getSession', () => {
    it('should return session data if it exists', async () => {
      // Create new request object with session cookie, and mock cookie parse and jwtVerify to return the payload
      const req = { headers: { cookie: 'session=encryptedToken' } } as unknown as NextApiRequest;
      const payload = { user: { email: 'test@test.com', role: 'admin', userID: 1 }, expires: new Date(Date.now() + 10 * 60 * 1000) };
      (cookie.parse as jest.Mock).mockReturnValue({ session: 'encryptedToken' });
      (jwtVerify as jest.Mock).mockResolvedValue({ payload });

      const result = await getSession(req);

      // Check if cookie parse and jwtVerify were called with the correct parameters, and the result is the payload
      expect(cookie.parse).toHaveBeenCalledWith(req.headers.cookie);
      expect(jwtVerify).toHaveBeenCalledWith('encryptedToken', key, { algorithms: ['HS256'] });
      expect(result).toEqual(payload);
    });

    it('should return null if no session cookie exists', async () => {
      // Mock null cookie
      const req = { headers: { cookie: '' } } as unknown as NextApiRequest;

      const result = await getSession(req);

      // Check if result is null
      expect(result).toBeNull();
    });

    it('should throw an error if session has expired', async () => {
      // Create new request object with session cookie, and mock cookie parse and jwtVerify to return the payload
      const req = { headers: { cookie: 'session=encryptedToken' } } as unknown as NextApiRequest;
      const payload = { user: { email: 'test@test.com', role: 'admin', userID: 1 }, expires: new Date(Date.now() - 10 * 60 * 1000) }; // Set expiration time to ten minutes ago
      (cookie.parse as jest.Mock).mockReturnValue({ session: 'encryptedToken' });
      (jwtVerify as jest.Mock).mockResolvedValue({ payload });

      // Check if getSession function throws an error if session has expired
      await expect(getSession(req)).rejects.toThrow('Session has expired');
    });
  });

  describe('updateSession', () => {
    it('should update session expiration time', async () => {
      // Create new request and response objects, with mocked cookie parse and jwtVerify to return the payload
      const req = { headers: { cookie: 'session=encryptedToken' } } as unknown as NextApiRequest;
      const res = { setHeader: jest.fn() } as unknown as NextApiResponse;
      const payload = { user: { email: 'test@test.com', role: 'admin', userID: 1 }, expires: new Date() };
      const newExpires = new Date(Date.now() + 10 * 60 * 1000);
      (cookie.parse as jest.Mock).mockReturnValue({ session: 'encryptedToken' });
      (jwtVerify as jest.Mock).mockResolvedValue({ payload });

      await updateSession(req, res);

      // Check if cookie parse and jwtVerify were called with the correct parameters, and if cookie serialize was called with the correct parameters
      expect(cookie.parse).toHaveBeenCalledWith(req.headers.cookie);
      expect(jwtVerify).toHaveBeenCalledWith('encryptedToken', key, { algorithms: ['HS256'] });
      expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', expect.any(String));
      expect(cookie.serialize).toHaveBeenCalledWith('session', 'encryptedToken', {
        httpOnly: true,
        expires: expect.any(Date), // Use any Date as actual date is sometimes off by a few milliseconds
        path: '/'
      });
    });
  });

  describe('updateSessionInMiddleware', () => {
    it('should update session expiration time in middleware', async () => {
      // Create new request object with session cookie, and mock jwtVerify to return the payload
      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: 'encryptedToken' })
        }
      } as unknown as NextRequest;
      const payload = { user: { email: 'test@test.com', role: 'admin', userID: 1 }, expires: new Date() };
      const newExpires = new Date(Date.now() + 10 * 60 * 1000);
      (jwtVerify as jest.Mock).mockResolvedValue({ payload });
      const nextResponse = {
        cookies: {
          set: jest.fn()
        }
      };
      (NextResponse.next as jest.Mock).mockReturnValue(nextResponse);

      const response = await updateSessionInMiddleware(request);

      // Check if jwtVerify was called with the correct parameters, and if cookie serialize was called with the correct parameters
      expect(jwtVerify).toHaveBeenCalledWith('encryptedToken', key, { algorithms: ['HS256'] });
      expect(response.cookies.set).toHaveBeenCalledWith('session', 'encryptedToken', {
        httpOnly: true,
        expires: expect.any(Date), // Use any Date as actual date is sometimes off by a few milliseconds
        path: '/'
      });
    });

    it('should return next response if no session cookie exists', async () => {
      // Create new request object with no session cookie
      const request = {
        cookies: {
          get: jest.fn().mockReturnValue(undefined)
        }
      } as unknown as NextRequest;
      const nextResponse = { cookies: { set: jest.fn() } };
      (NextResponse.next as jest.Mock).mockReturnValue(nextResponse);

      const response = await updateSessionInMiddleware(request);

      // Check if response is the mocked response
      expect(response).toBe(nextResponse);
    });
  });
});
