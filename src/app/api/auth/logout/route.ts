import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth';
import { jsonResponse } from '@/lib/validation';

// This route sets response cookies - must be dynamic
export const dynamic = 'force-dynamic';

export async function POST() {
  const response = jsonResponse({
    message: 'Logged out successfully.',
    success: true,
  });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
