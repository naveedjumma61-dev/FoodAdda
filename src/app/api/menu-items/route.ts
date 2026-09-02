import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { errorResponse, jsonResponse, handleApiError } from '@/lib/validation';
import { MENU_ITEMS_DATA } from '@/data/mockData';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');
    const category = searchParams.get('category');

    let items: any[] = [];
    try {
      const whereClause: any = {};
      if (restaurantId) whereClause.restaurantId = restaurantId;
      if (category && category !== 'All') whereClause.category = category;

      items = await prisma.menuItem.findMany({
        where: whereClause,
        include: {
          restaurant: {
            select: { id: true, name: true, category: true, active: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {
      console.warn('DB menu-items fallback:', e);
    }

    if (!items || items.length === 0) {
      items = MENU_ITEMS_DATA.map((item) => ({
        id: item.id,
        restaurantId: item.restaurantId,
        name: item.name,
        description: item.description,
        image: item.image,
        category: item.category,
        price: item.price,
        available: true,
        restaurant: { name: item.restaurantName },
      })) as any;
    }

    return jsonResponse({
      items,
      total: items.length,
      success: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(['ADMIN'], req);
    const body = await req.json();
    const { restaurantId, name, description, image, category, price, available } = body;

    if (!restaurantId || !name || price === undefined) {
      return errorResponse('Restaurant ID, name, and price are required.');
    }

    const item = await prisma.menuItem.create({
      data: {
        restaurantId,
        name: name.trim(),
        description: description || '',
        image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
        category: category || 'Fast Food',
        price: parseFloat(price),
        available: available !== undefined ? Boolean(available) : true,
      },
      include: {
        restaurant: { select: { id: true, name: true } },
      },
    });

    return jsonResponse({
      item,
      message: 'Menu item added successfully.',
      success: true,
    }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
