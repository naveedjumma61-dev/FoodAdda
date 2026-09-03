import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { errorResponse, jsonResponse, handleApiError } from '@/lib/validation';
import { OrderStatus, Role } from '@prisma/client';
import { MOCK_ORDERS_DATA, RESTAURANTS_DATA } from '@/data/mockData';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const roleParam = searchParams.get('role');

    let orders: any[] = [];
    let dbFailed = false;

    try {
      const whereClause: any = {};

      if (status && status !== 'all') {
        whereClause.status = status.toUpperCase() as OrderStatus;
      }

      // If user is logged in as Rider or requested rider view
      if (session?.role === 'RIDER' || roleParam === 'rider') {
        if (session?.userId) {
          const rider = await prisma.rider.findUnique({ where: { userId: session.userId } });
          if (rider) {
            whereClause.OR = [
              { riderId: rider.id },
              { status: { in: [OrderStatus.READY, OrderStatus.CONFIRMED, OrderStatus.PREPARING] } },
            ];
          }
        }
      } else if (session?.role === 'CUSTOMER') {
        whereClause.customerId = session.userId;
      } else if (session?.role !== 'ADMIN' && !roleParam) {
        if (session?.userId) {
          whereClause.customerId = session.userId;
        }
      }

      orders = await prisma.order.findMany({
        where: whereClause,
        include: {
          customer: {
            select: { id: true, name: true, email: true, phone: true, campus: true, hostel: true },
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
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {
      console.warn('Orders database query fallback:', e);
      dbFailed = true;
    }

    // Only fallback to mock orders if DB query failed and not logged in as a specific user
    if (dbFailed && !session) {
      orders = MOCK_ORDERS_DATA as any;
    }

    return jsonResponse({
      orders,
      total: orders.length,
      success: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    const body = await req.json();

    const {
      restaurantId,
      items, // array of { menuItemId, quantity, price, name }
      deliveryDetails,
      subtotal,
      deliveryFee,
      discount = 0,
      voucherCode,
    } = body;

    if (!restaurantId || !items || !Array.isArray(items) || items.length === 0) {
      return errorResponse('Order must contain a valid restaurant and at least one item.');
    }

    if (!deliveryDetails || !deliveryDetails.customerName || !deliveryDetails.customerPhone) {
      return errorResponse('Delivery name and contact phone are required.');
    }

    // Generate unique order number (e.g. STU-10482)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `STU-${randomSuffix}`;

    const calculatedSubtotal =
      parseFloat(subtotal) ||
      items.reduce(
        (sum: number, i: any) =>
          sum + (parseFloat(i.price) * (parseInt(i.quantity) || 1)),
        0
      );
    const calculatedFee =
      parseFloat(deliveryFee) !== undefined ? parseFloat(deliveryFee) : 70;
    const calculatedDiscount = parseFloat(discount) || 0;
    const calculatedTotal = Math.max(0, calculatedSubtotal + calculatedFee - calculatedDiscount);

    let customerId = session?.userId;

    // If customer is guest/unregistered, associate with or create customer user
    if (!customerId) {
      const guestEmail = `guest_${randomSuffix}@hosteladda.com`;
      try {
        const guestUser = await prisma.user.create({
          data: {
            name: deliveryDetails.customerName.trim(),
            email: guestEmail,
            phone: deliveryDetails.customerPhone.trim(),
            passwordHash: 'guest_no_login',
            role: Role.CUSTOMER,
            campus: deliveryDetails.campus || 'COMSATS University Islamabad',
            hostel: deliveryDetails.hostelName || 'Hostel City',
          },
        });
        customerId = guestUser.id;
      } catch (e) {
        const firstUser = await prisma.user.findFirst({ where: { role: Role.CUSTOMER } });
        customerId = firstUser?.id;
      }
    }

    // Ensure customerId exists
    if (!customerId) {
      const fallbackUser = await prisma.user.create({
        data: {
          name: deliveryDetails.customerName.trim() || 'Student Customer',
          email: `student_${randomSuffix}@hosteladda.com`,
          phone: deliveryDetails.customerPhone.trim() || '0300-0000000',
          passwordHash: 'guest_pass',
          role: Role.CUSTOMER,
          campus: deliveryDetails.campus || 'COMSATS University Islamabad',
          hostel: deliveryDetails.hostelName || 'Hostel City',
        },
      });
      customerId = fallbackUser.id;
    }

    // 1. Ensure target restaurant exists in PostgreSQL
    let targetRestaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!targetRestaurant) {
      // Look up by slug or name in mock data to get real details
      const mockRes = RESTAURANTS_DATA.find(
        (r) => r.id === restaurantId || r.name.toLowerCase() === restaurantId.toLowerCase()
      );

      if (mockRes) {
        try {
          targetRestaurant = await prisma.restaurant.create({
            data: {
              id: mockRes.id,
              name: mockRes.name,
              description: mockRes.tagline || 'Delicious campus food',
              logoImage: mockRes.logo,
              coverImage: mockRes.coverImage,
              category: mockRes.categories[0] || 'Fast Food',
              phone: mockRes.phone || '+92 300 0000000',
              address: mockRes.address || 'Hostel City, Islamabad',
              location: mockRes.campusZone || 'COMSATS Gate 1',
              openingHours: mockRes.openingHours || '10:00 AM - 03:00 AM',
              deliveryFee: mockRes.deliveryFee || 40,
              minimumOrder: mockRes.minOrder || 250,
              active: true,
            },
          });
        } catch (e) {
          // If already exists with that ID, find it
          targetRestaurant = await prisma.restaurant.findUnique({ where: { id: mockRes.id } });
        }
      }

      if (!targetRestaurant) {
        targetRestaurant = await prisma.restaurant.findFirst({ where: { active: true } });
      }
    }

    const validRestaurantId = targetRestaurant!.id;

    // 2. Ensure every order item's menuItemId exists in PostgreSQL to satisfy foreign key constraint
    const orderItemsToCreate = [];
    for (const item of items) {
      const targetItemId = item.menuItemId || item.id || `item-${Date.now()}`;
      const itemName = item.name || item.menuItem?.name || 'Campus Food Dish';
      const itemPrice = parseFloat(item.price) || (item.unitPrice ? parseFloat(item.unitPrice) : 250);
      const itemQuantity = parseInt(item.quantity) || 1;

      let menuItemRecord = await prisma.menuItem.findUnique({
        where: { id: targetItemId },
      });

      if (!menuItemRecord) {
        menuItemRecord = await prisma.menuItem.findFirst({
          where: {
            restaurantId: validRestaurantId,
            name: { equals: itemName, mode: 'insensitive' },
          },
        });
      }

      if (!menuItemRecord) {
        try {
          menuItemRecord = await prisma.menuItem.create({
            data: {
              id: targetItemId,
              restaurantId: validRestaurantId,
              name: itemName,
              description: item.description || item.menuItem?.description || 'Campus delicacy',
              image:
                item.image ||
                item.menuItem?.image ||
                'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=60',
              category: item.category || item.menuItem?.category || 'Fast Food',
              price: itemPrice,
              available: true,
            },
          });
        } catch (e) {
          menuItemRecord = await prisma.menuItem.findFirst({
            where: { restaurantId: validRestaurantId },
          });
        }
      }

      if (menuItemRecord) {
        orderItemsToCreate.push({
          menuItemId: menuItemRecord.id,
          quantity: itemQuantity,
          price: itemPrice,
        });
      }
    }

    // 3. Create the Order in PostgreSQL
    const createdOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customerId,
        restaurantId: validRestaurantId,
        status: OrderStatus.CONFIRMED,
        subtotal: calculatedSubtotal,
        deliveryFee: calculatedFee,
        discount: calculatedDiscount,
        total: calculatedTotal,
        deliveryAddress: `${deliveryDetails.hostelName || 'Hostel City'}, ${deliveryDetails.roomNumber || 'Room 101'}`,
        customerPhone: deliveryDetails.customerPhone,
        instructions: deliveryDetails.instructions || 'Call when at hostel gate.',
        paymentMethod: deliveryDetails.paymentMethod?.toUpperCase() || 'COD',
        orderItems: {
          create: orderItemsToCreate,
        },
      },
      include: {
        customer: true,
        restaurant: true,
        rider: {
          include: {
            user: true,
          },
        },
        orderItems: {
          include: { menuItem: true },
        },
      },
    });

    // Create Notification
    try {
      await prisma.notification.create({
        data: {
          userId: customerId,
          orderId: createdOrder.id,
          title: `Order #${orderNumber} Confirmed! 🎉`,
          message: `Your food order from ${createdOrder.restaurant.name} has been placed and sent to kitchen.`,
        },
      });
    } catch (e) {
      // non-critical
    }

    return jsonResponse(
      {
        order: createdOrder,
        orderNumber,
        message: 'Order created successfully and saved to database!',
        success: true,
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
