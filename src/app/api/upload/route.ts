import { NextRequest } from 'next/server';
import { uploadImage } from '@/lib/storage';
import { jsonResponse, handleApiError, errorResponse } from '@/lib/validation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle JSON payload with base64 image or direct URL
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { image, prefix } = body;

      if (!image) {
        return errorResponse('Image data or URL is required.');
      }

      const result = await uploadImage(image, prefix || 'dish');
      return jsonResponse(result);
    }

    // Handle multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('No file uploaded.');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadImage(buffer, 'upload');
    return jsonResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
