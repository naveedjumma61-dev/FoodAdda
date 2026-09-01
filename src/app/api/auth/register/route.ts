import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { errorResponse, jsonResponse, handleApiError } from '@/lib/validation';
import { Role } from '@prisma/client';

// This route sets response cookies - must be dynamic
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, campus, hostel, role } = body;

    if (!name || !email || !password || !phone) {
      return errorResponse('Name, email, phone, and password are required.');
    }

    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters.');
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return errorResponse('An account with this email already exists. Please log in.');
    }

    const passwordHash = await hashPassword(password);
    const assignedRole = role === 'RIDER' ? Role.RIDER : role === 'ADMIN' ? Role.ADMIN : Role.CUSTOMER;

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        passwordHash,
        role: assignedRole,
        campus: campus || 'COMSATS University Islamabad',
        hostel: hostel || 'Iqbal Hall (Boys Hostel 3)',
      },
    });

    // If registered as rider, create rider profile record
    if (assignedRole === Role.RIDER) {
      await prisma.rider.create({
        data: {
          userId: user.id,
          phone: user.phone,
          vehicleType: body.vehicleType || 'Honda CD 70',
          plateNumber: body.plateNumber || 'ICT-R-0000',
          active: true,
          available: true,
        },
      });
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

    const response = jsonResponse(
      {
        message: 'Account created successfully!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          campus: user.campus,
          hostel: user.hostel,
        },
        success: true,
      },
      201
    );

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
