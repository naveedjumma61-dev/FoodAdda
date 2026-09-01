import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { jsonResponse, handleApiError, errorResponse } from '@/lib/validation';
import { CAMPUS_LOCATIONS } from '@/data/mockData';

export async function GET() {
  try {
    let hostels: any[] = [];
    try {
      hostels = await prisma.hostel.findMany({
        orderBy: { campus: 'asc' },
      });
    } catch (e) {
      console.warn('Hostels DB fallback:', e);
    }

    if (!hostels || hostels.length === 0) {
      // Map mock data into structured response
      hostels = CAMPUS_LOCATIONS.flatMap((c) =>
        c.hostels.map((h) => ({
          id: `${c.id}-${h.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: h,
          campus: c.name,
          location: c.zone,
          address: c.address,
          deliveryCharge: 70,
        }))
      );
    }

    return jsonResponse({
      hostels,
      campuses: CAMPUS_LOCATIONS,
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
    const { name, address, location, campus, deliveryCharge } = body;

    if (!name || !campus) {
      return errorResponse('Hostel name and campus are required.');
    }

    const hostel = await prisma.hostel.create({
      data: {
        name: name.trim(),
        address: address || 'Islamabad',
        location: location || 'Chak Shehzad',
        campus: campus.trim(),
        deliveryCharge: parseFloat(deliveryCharge) || 70,
      },
    });

    return jsonResponse({ hostel, message: 'Hostel added successfully.', success: true }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
