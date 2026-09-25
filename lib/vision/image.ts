/** Raw pixels in the layout of the browser's ImageData (RGBA, row-major). */
export interface RGBAImage {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8ClampedArray;
}

export type RGB = readonly [r: number, g: number, b: number];

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function rgbAt(img: RGBAImage, x: number, y: number): RGB {
  const i = (y * img.width + x) * 4;
  return [img.data[i], img.data[i + 1], img.data[i + 2]];
}

export function hexToRgb(hex: string): RGB {
  const n = Number.parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/**
 * "Redmean" colour distance: a cheap approximation of perceived difference
 * (0 for identical colours, about 765 for black vs white).
 */
export function colorDistance(a: RGB, b: RGB): number {
  const rMean = (a[0] + b[0]) / 2;
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt((2 + rMean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rMean) / 256) * db * db);
}

/** Per-channel median of the pixels inside `rect` (clamped to the image). */
export function medianColor(img: RGBAImage, rect: Rect): RGB {
  const x0 = Math.max(0, Math.floor(rect.x));
  const y0 = Math.max(0, Math.floor(rect.y));
  const x1 = Math.min(img.width, Math.ceil(rect.x + rect.width));
  const y1 = Math.min(img.height, Math.ceil(rect.y + rect.height));
  const channels: number[][] = [[], [], []];
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * img.width + x) * 4;
      channels[0].push(img.data[i]);
      channels[1].push(img.data[i + 1]);
      channels[2].push(img.data[i + 2]);
    }
  }
  if (channels[0].length === 0) throw new Error('medianColor: empty region');
  const median = (values: number[]) => {
    values.sort((p, q) => p - q);
    return values[values.length >> 1];
  };
  return [median(channels[0]), median(channels[1]), median(channels[2])];
}
