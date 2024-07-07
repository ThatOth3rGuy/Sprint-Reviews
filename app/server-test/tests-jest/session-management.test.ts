import { encrypt, decrypt, login, logout, getSession, updateSession, updateSessionInMiddleware } from '../../src/lib';
import { SignJWT, jwtVerify } from 'jose';
import cookie from 'cookie';
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
  serialize: jest.fn()
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
      const payload = { user: { email: 'test@test.com', role: 'admin', userID: 1 }, expires: new Date() };

      const result = await encrypt(payload);

      expect(SignJWT).toHaveBeenCalledWith(payload);
      expect(result).toBe('encryptedToken');
    });
  });

  describe('decrypt', () => {
    it('should decrypt the token', async () => {
      const token = 'encryptedToken';
      const payload = { user: { email: 'test@test.com', role: 'admin', userID: 1 }, expires: new Date() };
      (jwtVerify as jest.Mock).mockResolvedValue({ payload });

      const result = await decrypt(token);

      expect(jwtVerify).toHaveBeenCalledWith(token, key, { algorithms: ['HS256'] });
      expect(result).toEqual(payload);
    });
  });

  describe('login', () => {
    it('should set session cookie on successful login', async () => {
      const req = { email: 'test@test.com', password: 'password', role: 'admin' };
      const res = { setHeader: jest.fn() } as unknown as NextApiResponse;
      const userID = 1;
      (query as jest.Mock).mockResolvedValue([{ userID }]);
      const expires = new Date(Date.now() + 10 * 60 * 1000);

      (cookie.serialize as jest.Mock).mockReturnValue('session=encryptedToken; Path=/; HttpOnly; Expires=' + expires.toUTCString());

      await login(req, res);

      expect(query).toHaveBeenCalledWith('SELECT userID FROM user WHERE email = ? AND pwd = ?', [req.email, req.password]);
      expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', expect.any(String));
      expect(cookie.serialize).toHaveBeenCalledWith('session', 'encryptedToken', {
        httpOnly: true,
        expires,
        path: '/'
      });
    });

    it('should throw an error if user not found', async () => {
      const req = { email: 'test@test.com', password: 'wrongpassword', role: 'admin' };
      const res = { setHeader: jest.fn() } as unknown as NextApiResponse;
      (query as jest.Mock).mockResolvedValue([]);

      await expect(login(req, res)).rejects.toThrow('User not found');
    });
  });

  describe('logout', () => {
    it('should clear the session cookie', async () => {
      const res = { setHeader: jest.fn() } as unknown as NextApiResponse;

      (cookie.serialize as jest.Mock).mockReturnValue('session=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT');

      await logout(res);

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
      const req = { headers: { cookie: 'session=encryptedToken' } } as unknown as NextApiRequest;
      const payload = { user: { email: 'test@test.com', role: 'admin', userID: 1 }, expires: new Date(Date.now() + 10 * 60 * 1000) };
      (cookie.parse as jest.Mock).mockReturnValue({ session: 'encryptedToken' });
      (jwtVerify as jest.Mock).mockResolvedValue({ payload });

      const result = await getSession(req);

      expect(cookie.parse).toHaveBeenCalledWith(req.headers.cookie);
      expect(jwtVerify).toHaveBeenCalledWith('encryptedToken', key, { algorithms: ['HS256'] });
      expect(result).toEqual(payload);
    });

    it('should return null if no session cookie exists', async () => {
      const req = { headers: { cookie: '' } } as unknown as NextApiRequest;

      const result = await getSession(req);

      expect(result).toBeNull();
    });

    it('should throw an error if session has expired', async () => {
      const req = { headers: { cookie: 'session=encryptedToken' } } as unknown as NextApiRequest;
      const payload = { user: { email: 'test@test.com', role: 'admin', userID: 1 }, expires: new Date(Date.now() - 10 * 60 * 1000) };
      (cookie.parse as jest.Mock).mockReturnValue({ session: 'encryptedToken' });
      (jwtVerify as jest.Mock).mockResolvedValue({ payload });

      await expect(getSession(req)).rejects.toThrow('Session has expired');
    });
  });

  describe('updateSession', () => {
    it('should update session expiration time', async () => {
      const req = { headers: { cookie: 'session=encryptedToken' } } as unknown as NextApiRequest;
      const res = { setHeader: jest.fn() } as unknown as NextApiResponse;
      const payload = { user: { email: 'test@test.com', role: 'admin', userID: 1 }, expires: new Date() };
      const newExpires = new Date(Date.now() + 10 * 60 * 1000);
      (cookie.parse as jest.Mock).mockReturnValue({ session: 'encryptedToken' });
      (jwtVerify as jest.Mock).mockResolvedValue({ payload });

      await updateSession(req, res);

      expect(cookie.parse).toHaveBeenCalledWith(req.headers.cookie);
      expect(jwtVerify).toHaveBeenCalledWith('encryptedToken', key, { algorithms: ['HS256'] });
      expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', expect.any(String));
      expect(cookie.serialize).toHaveBeenCalledWith('session', 'encryptedToken', {
        httpOnly: true,
        expires: newExpires,
        path: '/'
      });
    });
  });

  describe('updateSessionInMiddleware', () => {
    it('should update session expiration time in middleware', async () => {
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

      expect(jwtVerify).toHaveBeenCalledWith('encryptedToken', key, { algorithms: ['HS256'] });
      expect(response.cookies.set).toHaveBeenCalledWith('session', 'encryptedToken', {
        httpOnly: true,
        expires: newExpires,
        path: '/'
      });
    });

    it('should return next response if no session cookie exists', async () => {
      const request = {
        cookies: {
          get: jest.fn().mockReturnValue(undefined)
        }
      } as unknown as NextRequest;
      const nextResponse = { cookies: { set: jest.fn() } };
      (NextResponse.next as jest.Mock).mockReturnValue(nextResponse);

      const response = await updateSessionInMiddleware(request);

      expect(response).toBe(nextResponse);
    });
  });
});
