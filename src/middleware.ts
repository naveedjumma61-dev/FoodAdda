import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_COOKIE_NAME = 'hosteladda_session';
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'hosteladda-super-secure-campus-food-secret-key-2026'
);

interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'RIDER' | 'ADMIN';
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Function to verify token
  async function verifySessionToken(): Promise<TokenPayload | null> {
    if (!token) return null;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload as unknown as TokenPayload;
    } catch {
      return null;
    }
  }

  // 1. Protect /admin (ADMIN only)
  if (pathname.startsWith('/admin')) {
    const session = await verifySessionToken();
    if (!session) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('role', 'admin');
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    return NextResponse.next();
  }

  // 2. Protect /rider (RIDER and ADMIN)
  if (pathname.startsWith('/rider')) {
    const session = await verifySessionToken();
    if (!session) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('role', 'rider');
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== 'RIDER' && session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    return NextResponse.next();
  }

  // 3. Protect /dashboard (Any authenticated user)
  if (pathname.startsWith('/dashboard')) {
    const session = await verifySessionToken();
    if (!session) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 4. Protect /checkout (Authenticated user)
  if (pathname.startsWith('/checkout')) {
    const session = await verifySessionToken();
    if (!session) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/rider/:path*',
    '/dashboard/:path*',
    '/checkout/:path*',
  ],
};
