import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { errorResponse, jsonResponse, handleApiError } from '@/lib/validation';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN'], req);
    const id = params.id;
    const body = await req.json();

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        ...body,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        available: body.available !== undefined ? Boolean(body.available) : undefined,
      },
    });

    return jsonResponse({
      item: updated,
      message: 'Menu item updated successfully.',
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

    await prisma.menuItem.delete({
      where: { id },
    });

    return jsonResponse({
      message: 'Menu item deleted successfully.',
      success: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
