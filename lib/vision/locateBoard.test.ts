import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { FIXTURES } from '@/lib/vision/fixtures';
import type { RGBAImage } from '@/lib/vision/image';
import { locateBoard } from '@/lib/vision/locateBoard';
import { decodePng } from '@/lib/vision/testing/decodePng';

const load = (file: string) => decodePng(fileURLToPath(new URL(`./__fixtures__/${file}`, import.meta.url)));

/** A flat image filled with one colour. */
function solid(width: number, height: number, rgb: [number, number, number]): RGBAImage {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let p = 0; p < width * height; p++) data.set([...rgb, 255], p * 4);
  return { width, height, data };
}

describe('locateBoard', () => {
  it('finds the classic board on a desktop screenshot', () => {
    // classic-a: 500px board centred in the 785px left beside the scrollbar
    // (x = 142.5), bottom edge at y = 774. The search samples every 3rd pixel.
    const found = locateBoard(load('classic-a.png'));
    expect(found?.palette.id).toBe('classic');
    const { x, y, width, height } = found!.rect;
    expect(Math.abs(x - 142.5)).toBeLessThanOrEqual(4);
    expect(Math.abs(y - 274)).toBeLessThanOrEqual(4);
    expect(Math.abs(width - 500)).toBeLessThanOrEqual(6);
    expect(Math.abs(height - 500)).toBeLessThanOrEqual(6);
  });

  it.each(FIXTURES.map((f) => [f.file, f.palette] as const))('identifies the palette of %s', (file, palette) => {
    const found = locateBoard(load(file));
    expect(found?.palette.id).toBe(palette);
    expect(found!.rect.width / found!.rect.height).toBeGreaterThan(0.95);
    expect(found!.rect.width / found!.rect.height).toBeLessThan(1.05);
  });

  it('returns null when there is no board', () => {
    expect(locateBoard(solid(300, 500, [250, 248, 239]))).toBeNull();
    // A solid board-coloured rectangle (like the classic score box) is not a board.
    expect(locateBoard(solid(300, 300, [187, 173, 160]))).toBeNull();
  });
});
