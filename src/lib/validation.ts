import { NextResponse } from 'next/server';

export function jsonResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status: number = 400, details?: any) {
  return NextResponse.json(
    {
      error: message,
      details: details || null,
      success: false,
    },
    { status }
  );
}

export function handleApiError(error: unknown) {
  console.error('API Error occurred:', error);

  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') {
      return errorResponse('Please log in to continue.', 401);
    }
    if (error.message === 'FORBIDDEN') {
      return errorResponse('You do not have permission to perform this action.', 403);
    }
    return errorResponse(error.message, 400);
  }

  return errorResponse('An unexpected error occurred. Please try again later.', 500);
}
