import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { errorResponse, jsonResponse, handleApiError } from '@/lib/validation';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return errorResponse('Not authenticated', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        campus: true,
        hostel: true,
        createdAt: true,
        addresses: true,
        riderProfile: true,
      },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    return jsonResponse({
      user,
      success: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
