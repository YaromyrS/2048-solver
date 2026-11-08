import type { RGBAImage } from '@/lib/vision/image';

/** Refuse files larger than this; phone screenshots are a few MB at most. */
const MAX_FILE_BYTES = 25 * 1024 * 1024;
/** Scale images down so their longer side is at most this, which keeps reading fast. */
const MAX_SIDE = 1600;

export class ImageLoadError extends Error {}

/**
 * Decode an image file (from a file picker or the clipboard) into pixels,
 * scaled down to at most MAX_SIDE on its longer side. Browser only. The image
 * never leaves the device.
 */
export async function imageFromFile(file: Blob): Promise<RGBAImage> {
  if (!file.type.startsWith('image/')) throw new ImageLoadError('That file is not an image.');
  if (file.size > MAX_FILE_BYTES) throw new ImageLoadError('That image is too large (over 25 MB).');

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch (cause) {
    throw new ImageLoadError('That image could not be opened.', { cause });
  }
  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new ImageLoadError('This browser cannot read image pixels.');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);
    return { width, height, data };
  } finally {
    bitmap.close();
  }
}
