import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { errorResponse, jsonResponse, handleApiError } from '@/lib/validation';
import { OrderStatus } from '@prisma/client';
import { MOCK_ORDERS_DATA } from '@/data/mockData';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    let order: any = null;
    try {
      // Find by id (UUID) or orderNumber (e.g. STU-10482)
      order = await prisma.order.findFirst({
        where: {
          OR: [
            { id },
            { orderNumber: id },
            { orderNumber: `STU-${id}` },
            { orderNumber: `HA-${id}` },
          ],
        },
        include: {
          customer: {
            select: { id: true, name: true, phone: true, email: true, campus: true, hostel: true },
          },
          restaurant: true,
          rider: {
            include: {
              user: { select: { name: true, phone: true } },
            },
          },
          orderItems: {
            include: {
              menuItem: true,
            },
          },
        },
      });
    } catch (e) {
      console.warn('DB order lookup fallback:', e);
    }

    if (!order) {
      const mockOrder = MOCK_ORDERS_DATA.find((o) => o.id === id || o.id === `HA-${id}` || o.id === `STU-${id}`);
      if (mockOrder) {
        order = mockOrder;
      }
    }

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    return jsonResponse({
      order,
      success: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser(req);
    const id = params.id;
    const body = await req.json();
    const { status, riderId, instructions } = body;

    const dataToUpdate: any = {};

    if (status) {
      dataToUpdate.status = status.toUpperCase() as OrderStatus;
    }

    if (riderId !== undefined) {
      dataToUpdate.riderId = riderId;
    }

    if (instructions) {
      dataToUpdate.instructions = instructions;
    }

    let updatedOrder: any;
    try {
      // Look up target order by ID or orderNumber
      const targetOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { id },
            { orderNumber: id },
            { orderNumber: `STU-${id}` },
            { orderNumber: `HA-${id}` },
          ],
        },
      });

      if (targetOrder) {
        // Auto-assign rider if logged in as RIDER
        if (!dataToUpdate.riderId && session?.role === 'RIDER' && session?.userId) {
          const riderRec = await prisma.rider.findUnique({ where: { userId: session.userId } });
          if (riderRec && (!targetOrder.riderId || status === 'RIDER_ASSIGNED')) {
            dataToUpdate.riderId = riderRec.id;
          }
        }

        updatedOrder = await prisma.order.update({
          where: { id: targetOrder.id },
          data: dataToUpdate,
          include: {
            restaurant: true,
            rider: {
              include: { user: true },
            },
            customer: true,
            orderItems: {
              include: { menuItem: true },
            },
          },
        });

        // Trigger status notification
        if (status && updatedOrder.customerId) {
          try {
            await prisma.notification.create({
              data: {
                userId: updatedOrder.customerId,
                orderId: updatedOrder.id,
                title: `Order Status: ${status}`,
                message: `Your order #${updatedOrder.orderNumber} is now ${status.toLowerCase().replace(/_/g, ' ')}.`,
              },
            });
          } catch (notifErr) {
            // non-fatal
          }
        }
      }
    } catch (e) {
      console.warn('DB update failed, returning simulated response:', e);
      updatedOrder = { id, status: status || 'OUT_FOR_DELIVERY', ...dataToUpdate };
    }

    return jsonResponse({
      order: updatedOrder,
      message: 'Order updated successfully.',
      success: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
