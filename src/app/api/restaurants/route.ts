import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { errorResponse, jsonResponse, handleApiError } from '@/lib/validation';
import { RESTAURANTS_DATA } from '@/data/mockData';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const campus = searchParams.get('campus');

    // Query database with fallback to mock data if database is initialising
    let restaurants: any[] = [];
    try {
      const whereClause: any = { active: true };

      if (category && category !== 'All') {
        whereClause.category = { contains: category, mode: 'insensitive' };
      }

      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (campus) {
        whereClause.location = { contains: campus, mode: 'insensitive' };
      }

      restaurants = await prisma.restaurant.findMany({
        where: whereClause,
        include: {
          menuItems: {
            where: { available: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
    } catch (dbError) {
      console.warn('Database query fallback to seed data:', dbError);
    }

    // Fallback to local data if DB empty or unavailable
    if (!restaurants || restaurants.length === 0) {
      restaurants = RESTAURANTS_DATA as any;
    }

    return jsonResponse({
      restaurants,
      total: restaurants.length,
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
    const { name, description, logoImage, coverImage, category, phone, address, location, openingHours, deliveryFee, minimumOrder } = body;

    if (!name || !category || !phone || !address) {
      return errorResponse('Name, category, phone, and address are required.');
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name: name.trim(),
        description: description || 'Delicious campus food',
        logoImage: logoImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80',
        category: category.trim(),
        phone: phone.trim(),
        address: address.trim(),
        location: location || 'Chak Shehzad, Islamabad',
        openingHours: openingHours || '10:00 AM - 03:00 AM',
        deliveryFee: parseFloat(deliveryFee) || 40,
        minimumOrder: parseFloat(minimumOrder) || 250,
        active: true,
      },
    });

    return jsonResponse({ restaurant, success: true, message: 'Restaurant created successfully.' }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
