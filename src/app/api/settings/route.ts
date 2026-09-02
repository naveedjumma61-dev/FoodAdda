import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { jsonResponse, handleApiError, errorResponse } from '@/lib/validation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    let settings: any = null;
    try {
      settings = await prisma.setting.findFirst();
    } catch (e) {
      console.warn('Settings DB fallback:', e);
    }

    if (!settings) {
      settings = {
        id: 'default-settings',
        platformName: 'HostelAdda',
        currency: 'PKR',
        campusDeliveryFee: 89,
        hostelDeliveryFee: 70,
        campusMinimumOrder: 500,
        hostelMinimumOrder: 300,
        contactPhone: '+92 301 555-ADDA',
        contactEmail: 'support@hosteladda.com',
      };
    }

    return jsonResponse({
      settings,
      success: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireRole(['ADMIN'], req);
    const body = await req.json();

    const existing = await prisma.setting.findFirst();
    let updated;

    if (existing) {
      updated = await prisma.setting.update({
        where: { id: existing.id },
        data: {
          campusDeliveryFee: body.campusDeliveryFee ? parseFloat(body.campusDeliveryFee) : undefined,
          hostelDeliveryFee: body.hostelDeliveryFee ? parseFloat(body.hostelDeliveryFee) : undefined,
          campusMinimumOrder: body.campusMinimumOrder ? parseFloat(body.campusMinimumOrder) : undefined,
          hostelMinimumOrder: body.hostelMinimumOrder ? parseFloat(body.hostelMinimumOrder) : undefined,
          contactPhone: body.contactPhone,
          contactEmail: body.contactEmail,
          platformName: body.platformName,
        },
      });
    } else {
      updated = await prisma.setting.create({
        data: {
          campusDeliveryFee: parseFloat(body.campusDeliveryFee) || 89,
          hostelDeliveryFee: parseFloat(body.hostelDeliveryFee) || 70,
          campusMinimumOrder: parseFloat(body.campusMinimumOrder) || 500,
          hostelMinimumOrder: parseFloat(body.hostelMinimumOrder) || 300,
          contactPhone: body.contactPhone || '+92 301 555-ADDA',
          contactEmail: body.contactEmail || 'support@hosteladda.com',
        },
      });
    }

    return jsonResponse({
      settings: updated,
      message: 'Platform settings updated successfully.',
      success: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
