/** Helper functions for chat image upload validation and compression */
import sharp from 'sharp';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_WIDTH = 800;
const WEBP_QUALITY = 75;

interface ValidationResult {
  valid: boolean;
  error?: string;
}

/** Validates that an uploaded file is an allowed image type and within size limits */
export function validateImageFile(mimeType: string, size: number): ValidationResult {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return { valid: false, error: 'Nur JPEG, PNG oder WebP Bilder erlaubt' };
  }
  if (size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Datei darf maximal 5 MB groß sein' };
  }
  return { valid: true };
}

/** Compresses an image buffer to WebP format, resized to max 800px width */
export async function compressImage(
  buffer: Buffer,
  _mimeType: string
): Promise<{ data: Buffer; width: number; height: number }> {
  const image = sharp(buffer).resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: WEBP_QUALITY });
  const outputBuffer = await image.toBuffer();
  const metadata = await sharp(outputBuffer).metadata();
  return {
    data: outputBuffer,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
}
