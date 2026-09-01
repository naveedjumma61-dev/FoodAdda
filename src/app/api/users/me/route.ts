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
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
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

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return errorResponse('Not authenticated', 401);
    }

    const body = await req.json();
    const { name, phone, campus, hostel, newAddress } = body;

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();
    if (campus) updateData.campus = campus.trim();
    if (hostel) updateData.hostel = hostel.trim();

    // If adding a new saved address
    if (newAddress && newAddress.building && newAddress.room) {
      await prisma.userAddress.create({
        data: {
          userId: session.userId,
          building: newAddress.building.trim(),
          room: newAddress.room.trim(),
          instructions: newAddress.instructions?.trim() || null,
          isDefault: Boolean(newAddress.isDefault),
        },
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        campus: true,
        hostel: true,
        addresses: true,
      },
    });

    return jsonResponse({
      user: updatedUser,
      message: 'Profile updated successfully.',
      success: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
