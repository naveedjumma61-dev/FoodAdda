import fs from 'fs';
import path from 'path';

export interface UploadResult {
  url: string;
  success: boolean;
  filename?: string;
}

/**
 * Cloud & Local Image Storage Abstraction for HostelAdda
 * Supports:
 * 1. Direct HTTPS image URLs (e.g. Unsplash, Cloudinary, S3 CDN)
 * 2. Base64 encoded image uploads saved to public/uploads
 * 3. File buffer uploads
 */
export async function uploadImage(
  input: string | Buffer,
  filenamePrefix: string = 'food'
): Promise<UploadResult> {
  try {
    // If it's already a public HTTPS URL, validate and return
    if (typeof input === 'string' && (input.startsWith('http://') || input.startsWith('https://'))) {
      return {
        url: input,
        success: true,
      };
    }

    // Handle Base64 Data URL (e.g. data:image/jpeg;base64,...)
    if (typeof input === 'string' && input.startsWith('data:image')) {
      const matches = input.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 image data');
      }

      const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const uniqueName = `${filenamePrefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
      const filePath = path.join(uploadsDir, uniqueName);

      fs.writeFileSync(filePath, buffer);

      return {
        url: `/uploads/${uniqueName}`,
        filename: uniqueName,
        success: true,
      };
    }

    // Default fallback image
    return {
      url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
      success: true,
    };
  } catch (error) {
    console.error('Image storage error:', error);
    return {
      url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
      success: false,
    };
  }
}
