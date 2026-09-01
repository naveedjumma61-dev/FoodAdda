import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'hosteladda_session';
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'hosteladda-super-secure-campus-food-secret-key-2026'
);

export type UserRole = 'CUSTOMER' | 'RIDER' | 'ADMIN';

export interface AuthUserPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  campus?: string | null;
  hostel?: string | null;
}

// Password Hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT Token Signing & Verification
export async function signToken(payload: AuthUserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthUserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthUserPayload;
  } catch (error) {
    return null;
  }
}

// Extract Session from Request Cookies
export async function getSessionUser(req?: NextRequest): Promise<AuthUserPayload | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
  } else {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    } catch (e) {
      // Cookies not accessible in some contexts
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

// Role Authorization Helper
export async function requireAuth(req?: NextRequest): Promise<AuthUserPayload> {
  const user = await getSessionUser(req);
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[], req?: NextRequest): Promise<AuthUserPayload> {
  const user = await requireAuth(req);
  if (!allowedRoles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}

export { AUTH_COOKIE_NAME };
