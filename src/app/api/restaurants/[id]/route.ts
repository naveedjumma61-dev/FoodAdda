import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { errorResponse, jsonResponse, handleApiError } from '@/lib/validation';
import { RESTAURANTS_DATA, MENU_ITEMS_DATA } from '@/data/mockData';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    let restaurant: any = null;
    try {
      restaurant = await prisma.restaurant.findUnique({
        where: { id },
        include: {
          menuItems: true,
        },
      });
    } catch (e) {
      console.warn('DB lookup failed, searching mock data', e);
    }

    // Fallback to mock data by slug or id
    if (!restaurant) {
      const mockRes = RESTAURANTS_DATA.find((r) => r.id === id);
      if (mockRes) {
        const mockItems = MENU_ITEMS_DATA.filter((m) => m.restaurantId === mockRes.id);
        restaurant = {
          ...mockRes,
          menuItems: mockItems,
        };
      }
    }

    if (!restaurant) {
      return errorResponse('Restaurant not found', 404);
    }

    return jsonResponse({
      restaurant,
      success: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN'], req);
    const id = params.id;
    const body = await req.json();

    const updated = await prisma.restaurant.update({
      where: { id },
      data: {
        ...body,
        deliveryFee: body.deliveryFee !== undefined ? parseFloat(body.deliveryFee) : undefined,
        minimumOrder: body.minimumOrder !== undefined ? parseFloat(body.minimumOrder) : undefined,
      },
    });

    return jsonResponse({
      restaurant: updated,
      message: 'Restaurant updated successfully.',
      success: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN'], req);
    const id = params.id;

    // Soft delete / disable
    await prisma.restaurant.update({
      where: { id },
      data: { active: false },
    });

    return jsonResponse({
      message: 'Restaurant disabled successfully.',
      success: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
