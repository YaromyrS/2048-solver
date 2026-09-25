import type { Board } from '@/lib/game/board';
import { GLYPH_H, GLYPH_W } from '@/lib/vision/glyph';
import type { RGBAImage } from '@/lib/vision/image';
import { locateBoard } from '@/lib/vision/locateBoard';
import { glyphAt, type TextTemplate } from '@/lib/vision/readBoard';
import { GENERATED_TEMPLATES } from '@/lib/vision/templates.generated';

/**
 * Fixtures the shipped templates are cut from: every value 2 … 131072 in the
 * classic font (Clear Sans) and in play2048.co's (Rubik). The other fixtures
 * are held out, so the tests measure reading boards the templates never saw.
 */
export const TEMPLATE_SOURCES = ['classic-a.png', 'classic-b.png', 'play2048-light-a.png', 'play2048-light-b.png'];

/** One template per tile of a screenshot whose board is known. */
export function templatesFromScreenshot(img: RGBAImage, board: Board): TextTemplate[] {
  const located = locateBoard(img);
  if (!located) throw new Error('templatesFromScreenshot: no board in the image');
  const templates: TextTemplate[] = [];
  board.forEach((cells, row) =>
    cells.forEach((value, col) => {
      if (value === 0) return;
      const glyph = glyphAt(img, located.rect, row, col);
      if (!glyph) throw new Error(`templatesFromScreenshot: no number found for ${value} at ${row},${col}`);
      templates.push({ value, ...glyph });
    }),
  );
  return templates;
}

/** Serialised form: `value:aspect:base64` of the 0..255-quantised pixels, one per template. */
export function encodeTemplates(templates: readonly TextTemplate[]): string[] {
  return templates.map((t) => {
    let bytes = '';
    for (const v of t.pixels) bytes += String.fromCharCode(Math.round(v * 255));
    return `${t.value}:${t.aspect.toFixed(4)}:${btoa(bytes)}`;
  });
}

export function decodeTemplates(encoded: readonly string[]): TextTemplate[] {
  return encoded.map((line) => {
    const [value, aspect, data] = line.split(':');
    const bytes = atob(data);
    if (bytes.length !== GLYPH_W * GLYPH_H) throw new Error(`decodeTemplates: bad template for ${value}`);
    const pixels = new Float32Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) pixels[i] = bytes.charCodeAt(i) / 255;
    return { value: Number(value), aspect: Number(aspect), pixels };
  });
}

/** The templates the app reads screenshots with. */
export const TEMPLATES: readonly TextTemplate[] = decodeTemplates(GENERATED_TEMPLATES);
