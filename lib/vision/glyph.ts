import { colorDistance, rgbAt, type RGB, type RGBAImage, type Rect } from '@/lib/vision/image';

/** Normalised size of a tile's number: wide and short, like the numbers themselves. */
export const GLYPH_W = 32;
export const GLYPH_H = 16;

/** A tile's number, cropped to its ink and resampled to GLYPH_W × GLYPH_H. */
export interface Glyph {
  /** Width / height of the ink's bounding box, before resampling. */
  aspect: number;
  /** Ink coverage per cell, 0..1, row-major. */
  pixels: Float32Array;
}

/**
 * Colour distance from the tile background below which a pixel is surely not
 * ink … Numbers differ from their tile by 250+; gradients, glows and JPEG noise
 * inside a tile stay under about 100.
 */
const INK_FROM = 90;
/** … and above which it surely is (in between: anti-aliased edge, partial ink). */
const INK_TO = 200;
/** Ignore rows/columns with less total ink than this (stray specks). */
const MIN_LINE_INK = 0.6;
/** Ink blobs smaller than this share of the crop are noise, not digit strokes. */
const MIN_BLOB_SHARE = 0.002;

/**
 * Extract the number printed on a tile. `background` holds the tile's colours
 * (two ends of its gradient); ink is whatever differs from both. Returns null
 * when the area holds no ink at all.
 */
export function extractGlyph(img: RGBAImage, area: Rect, background: readonly RGB[]): Glyph | null {
  const x0 = Math.max(0, Math.round(area.x));
  const y0 = Math.max(0, Math.round(area.y));
  const w = Math.min(img.width, Math.round(area.x + area.width)) - x0;
  const h = Math.min(img.height, Math.round(area.y + area.height)) - y0;
  if (w <= 0 || h <= 0) return null;

  const ink = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = rgbAt(img, x0 + x, y0 + y);
      let d = Infinity;
      for (const bg of background) d = Math.min(d, colorDistance(px, bg));
      ink[y * w + x] = Math.min(1, Math.max(0, (d - INK_FROM) / (INK_TO - INK_FROM)));
    }
  }
  eraseStrayInk(ink, w, h);

  const colInk = new Float32Array(w);
  const rowInk = new Float32Array(h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      colInk[x] += ink[y * w + x];
      rowInk[y] += ink[y * w + x];
    }
  }
  const first = (a: Float32Array) => a.findIndex((v) => v >= MIN_LINE_INK);
  const last = (a: Float32Array) => a.length - 1 - [...a].reverse().findIndex((v) => v >= MIN_LINE_INK);
  const left = first(colInk);
  const top = first(rowInk);
  if (left < 0 || top < 0) return null;
  const right = last(colInk);
  const bottom = last(rowInk);
  const bw = right - left + 1;
  const bh = bottom - top + 1;

  // Box-filter resample: each output cell averages a 4×4 grid of samples from
  // its share of the bounding box.
  const pixels = new Float32Array(GLYPH_W * GLYPH_H);
  const SUB = 4;
  for (let gy = 0; gy < GLYPH_H; gy++) {
    for (let gx = 0; gx < GLYPH_W; gx++) {
      let sum = 0;
      for (let sy = 0; sy < SUB; sy++) {
        for (let sx = 0; sx < SUB; sx++) {
          const x = left + Math.min(bw - 1, Math.floor(((gx + (sx + 0.5) / SUB) * bw) / GLYPH_W));
          const y = top + Math.min(bh - 1, Math.floor(((gy + (sy + 0.5) / SUB) * bh) / GLYPH_H));
          sum += ink[y * w + x];
        }
      }
      pixels[gy * GLYPH_W + gx] = sum / (SUB * SUB);
    }
  }
  return { aspect: bw / bh, pixels };
}

/**
 * Remove ink blobs that are not digit strokes, plus a 1px halo around each:
 * - blobs touching the edge of the crop: the digits sit well inside the tile,
 *   so these are tile borders, inner shadows or a neighbour's glow;
 * - tiny blobs: noise (no digit has a separate dot).
 */
function eraseStrayInk(ink: Float32Array, w: number, h: number): void {
  const minBlob = Math.max(3, w * h * MIN_BLOB_SHARE);
  const label = new Int32Array(w * h).fill(-1);
  const erase = new Uint8Array(w * h);
  const stack: number[] = [];
  for (let start = 0; start < ink.length; start++) {
    if (ink[start] < 0.5 || label[start] >= 0) continue;
    const members: number[] = [];
    let touchesEdge = false;
    label[start] = start;
    stack.push(start);
    while (stack.length > 0) {
      const i = stack.pop()!;
      members.push(i);
      const y = Math.floor(i / w);
      const x = i - y * w;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touchesEdge = true;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const n = ny * w + nx;
          if (ink[n] >= 0.5 && label[n] < 0) {
            label[n] = start;
            stack.push(n);
          }
        }
      }
    }
    if (touchesEdge || members.length < minBlob) for (const i of members) erase[i] = 1;
  }
  for (let i = 0; i < ink.length; i++) {
    if (!erase[i]) continue;
    const y = Math.floor(i / w);
    const x = i - y * w;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < w && ny < h) ink[ny * w + nx] = 0;
      }
    }
  }
}

/**
 * How alike two glyphs are: 1 for identical, lower as their ink differs or
 * their proportions do (so "16" and "1024" never match, however they stretch).
 */
export function glyphSimilarity(a: Glyph, b: Glyph): number {
  let diff = 0;
  for (let i = 0; i < a.pixels.length; i++) diff += Math.abs(a.pixels[i] - b.pixels[i]);
  return 1 - diff / a.pixels.length - 0.5 * Math.abs(Math.log(a.aspect / b.aspect));
}
