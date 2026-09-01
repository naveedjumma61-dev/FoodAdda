import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { errorResponse, jsonResponse, handleApiError } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse('Please provide both email and password.');
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        riderProfile: true,
      },
    });

    if (!user) {
      return errorResponse('Invalid email or password. Please try again.', 401);
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse('Invalid email or password. Please try again.', 401);
    }

    // Sign JWT token
    const token = await signToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      phone: user.phone,
      campus: user.campus,
      hostel: user.hostel,
    });

    const response = jsonResponse({
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        campus: user.campus,
        hostel: user.hostel,
        riderProfile: user.riderProfile,
      },
      success: true,
    });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
