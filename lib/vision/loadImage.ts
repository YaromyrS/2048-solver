import type { RGBAImage } from '@/lib/vision/image';

/** Refuse files larger than this; phone screenshots are a few MB at most. */
const MAX_FILE_BYTES = 25 * 1024 * 1024;
/** Scale images down so their longer side is at most this, which keeps reading fast. */
const MAX_SIDE = 1600;

/** Why an image couldn't be read; the UI shows a translated message for each. */
export type ImageLoadErrorCode = 'notImage' | 'tooLarge' | 'cannotOpen' | 'noCanvas';

export class ImageLoadError extends Error {
  constructor(
    readonly code: ImageLoadErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'ImageLoadError';
  }
}

/**
 * Decode an image file (from a file picker or the clipboard) into pixels,
 * scaled down to at most MAX_SIDE on its longer side. Browser only. The image
 * never leaves the device.
 */
export async function imageFromFile(file: Blob): Promise<RGBAImage> {
  if (!file.type.startsWith('image/')) {
    throw new ImageLoadError('notImage', `Not an image: ${file.type || 'unknown type'}`);
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new ImageLoadError('tooLarge', `Image is ${file.size} bytes, over ${MAX_FILE_BYTES}`);
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch (cause) {
    throw new ImageLoadError('cannotOpen', 'createImageBitmap failed', { cause });
  }
  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new ImageLoadError('noCanvas', 'No 2D canvas context');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);
    return { width, height, data };
  } finally {
    bitmap.close();
  }
}
