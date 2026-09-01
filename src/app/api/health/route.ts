import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const restaurantCount = await prisma.restaurant.count();
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      userCount,
      restaurantCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Database health check failed:', error);
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error?.message || 'Unknown error',
    }, { status: 500 });
  }
}
