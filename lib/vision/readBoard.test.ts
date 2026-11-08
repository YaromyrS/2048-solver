import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { FIXTURES } from '@/lib/vision/fixtures';
import type { RGBAImage } from '@/lib/vision/image';
import { readBoard } from '@/lib/vision/readBoard';
import { TEMPLATE_SOURCES, TEMPLATES } from '@/lib/vision/templates';
import { decodePng } from '@/lib/vision/testing/decodePng';
import { addNoise, resize } from '@/lib/vision/testing/transform';

const load = (file: string) => decodePng(fileURLToPath(new URL(`./__fixtures__/${file}`, import.meta.url)));

const heldOut = FIXTURES.filter((f) => !TEMPLATE_SOURCES.includes(f.file));

describe('readBoard', () => {
  it('has held-out fixtures for every palette', () => {
    expect(new Set(heldOut.map((f) => f.palette))).toEqual(new Set(['classic', 'play2048-light', 'play2048-dark']));
  });

  it.each(heldOut.map((f) => [f.file, f] as const))('reads %s (not used for templates)', (_file, fixture) => {
    const reading = readBoard(load(fixture.file), TEMPLATES);
    expect(reading?.palette).toBe(fixture.palette);
    expect(reading?.board).toEqual(fixture.board);
  });

  it.each(FIXTURES.map((f) => [f.file, f] as const))('is confident about every cell of %s', (_file, fixture) => {
    const reading = readBoard(load(fixture.file), TEMPLATES)!;
    expect(Math.min(...reading.confidence.flat())).toBeGreaterThan(0.05);
  });

  // Real screenshots come at other pixel densities and with compression noise.
  it.each([
    ['2× larger', (img: RGBAImage) => resize(img, 2)],
    ['0.75× smaller', (img: RGBAImage) => resize(img, 0.75)],
    ['noisy (±12 per channel)', (img: RGBAImage) => addNoise(img, 12)],
  ])(
    'still reads every held-out fixture when %s',
    (_label, transform) => {
      for (const fixture of heldOut) {
        expect(readBoard(transform(load(fixture.file)), TEMPLATES)?.board, fixture.file).toEqual(fixture.board);
      }
    },
    30_000, // the pure-JS resize of five screenshots is slow, not the reading
  );

  it('returns null for an image without a board', () => {
    const blank: RGBAImage = { width: 200, height: 200, data: new Uint8ClampedArray(200 * 200 * 4).fill(255) };
    expect(readBoard(blank, TEMPLATES)).toBeNull();
  });
});
