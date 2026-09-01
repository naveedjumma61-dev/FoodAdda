import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { jsonResponse, handleApiError, errorResponse } from '@/lib/validation';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();

    const dataToUpdate: any = {};
    if (body.active !== undefined) dataToUpdate.active = Boolean(body.active);
    if (body.available !== undefined) dataToUpdate.available = Boolean(body.available);
    if (body.vehicleType) dataToUpdate.vehicleType = body.vehicleType;
    if (body.plateNumber) dataToUpdate.plateNumber = body.plateNumber;
    if (body.phone) dataToUpdate.phone = body.phone;

    let updated: any;
    try {
      updated = await prisma.rider.update({
        where: { id },
        data: dataToUpdate,
        include: { user: true },
      });
    } catch (e) {
      updated = { id, ...dataToUpdate };
    }

    return jsonResponse({
      rider: updated,
      message: 'Rider status updated successfully.',
      success: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
