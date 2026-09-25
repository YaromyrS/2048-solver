import { SIZE, type Board } from '@/lib/game/board';
import { extractGlyph, glyphSimilarity, type Glyph } from '@/lib/vision/glyph';
import { colorDistance, medianColor, type RGB, type RGBAImage, type Rect } from '@/lib/vision/image';
import { locateBoard } from '@/lib/vision/locateBoard';
import type { Palette, PaletteId } from '@/lib/vision/palettes';

/** Every value a tile can show: 2 … 131072 (the largest reachable on 4×4). */
export const TILE_VALUES: readonly number[] = Array.from({ length: 17 }, (_, i) => 2 ** (i + 1));

/** A known rendering of a tile's number, to compare unknown tiles against. */
export interface TextTemplate extends Glyph {
  value: number;
}

export interface BoardReading {
  board: Board;
  /**
   * Per cell, 0..1: how clearly the chosen value beat the runner-up. Empty
   * cells are 1. Low values are worth showing to the user for a check.
   */
  confidence: number[][];
  palette: PaletteId;
}

/** A cell this close to the palette's empty colour holds no tile. */
const EMPTY_TOLERANCE = 30;
/** How much the tile colour counts next to the number's shape (0..1 scale each). */
const COLOR_WEIGHT = 0.3;
/** Colour distance at which the colour score has fallen to 1/e. */
const COLOR_SCALE = 40;
/**
 * Width of the frame and of each gap between tiles, as a fraction of the board
 * side. Classic uses 3% (desktop) to 3.6% (phones); play2048.co about 2%; this
 * middle value keeps every modelled tile inside the real one.
 */
const GAP_RATIO = 0.03;
/** Keep the number crop this far (fraction of the tile) inside the tile, clear of its edge effects. */
const TEXT_INSET = 0.08;

/** Tile (row, col) of the board, shrunk by `inset` (fraction of the tile) on every side. */
function tileArea(board: Rect, row: number, col: number, inset: number): Rect {
  const gx = board.width * GAP_RATIO;
  const gy = board.height * GAP_RATIO;
  const tw = (board.width - (SIZE + 1) * gx) / SIZE;
  const th = (board.height - (SIZE + 1) * gy) / SIZE;
  return {
    x: board.x + gx + col * (tw + gx) + inset * tw,
    y: board.y + gy + row * (th + gy) + inset * th,
    width: tw * (1 - 2 * inset),
    height: th * (1 - 2 * inset),
  };
}

/**
 * The tile's colour above and below its number (bands at 12–24% and 76–88% of
 * the tile height, middle 60% of its width). Tiles can be gradients, so both
 * ends are kept.
 */
function tileBands(img: RGBAImage, board: Rect, row: number, col: number): [RGB, RGB] {
  const tile = tileArea(board, row, col, 0);
  const band = (from: number): Rect => ({
    x: tile.x + tile.width * 0.2,
    y: tile.y + tile.height * from,
    width: tile.width * 0.6,
    height: tile.height * 0.12,
  });
  return [medianColor(img, band(0.12)), medianColor(img, band(0.76))];
}

const mean = (a: RGB, b: RGB): RGB => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];

/** The number printed in cell (row, col), or null for an empty cell. */
export function glyphAt(img: RGBAImage, board: Rect, row: number, col: number): Glyph | null {
  return extractGlyph(img, tileArea(board, row, col, TEXT_INSET), tileBands(img, board, row, col));
}

function readCell(
  img: RGBAImage,
  board: Rect,
  row: number,
  col: number,
  palette: Palette,
  templates: readonly TextTemplate[],
): { value: number; confidence: number } {
  const bands = tileBands(img, board, row, col);
  const color = mean(bands[0], bands[1]);
  if (colorDistance(color, palette.empty) < EMPTY_TOLERANCE) return { value: 0, confidence: 1 };

  const glyph = extractGlyph(img, tileArea(board, row, col, TEXT_INSET), bands);
  const scored = TILE_VALUES.map((value) => {
    const expected = palette.tiles.get(value) ?? palette.overflow;
    const colorScore = Math.exp(-colorDistance(color, expected) / COLOR_SCALE);
    let textScore = 0;
    if (glyph) {
      for (const t of templates) {
        if (t.value === value) textScore = Math.max(textScore, glyphSimilarity(glyph, t));
      }
    }
    return { value, score: textScore + COLOR_WEIGHT * colorScore };
  }).sort((a, b) => b.score - a.score);

  const [best, runnerUp] = scored;
  return { value: best.value, confidence: Math.min(1, Math.max(0, best.score - runnerUp.score)) };
}

/** Find the board in a screenshot and read every cell. Null when no board is found. */
export function readBoard(img: RGBAImage, templates: readonly TextTemplate[]): BoardReading | null {
  const located = locateBoard(img);
  if (!located) return null;
  const board: Board = [];
  const confidence: number[][] = [];
  for (let row = 0; row < SIZE; row++) {
    board.push([]);
    confidence.push([]);
    for (let col = 0; col < SIZE; col++) {
      const cell = readCell(img, located.rect, row, col, located.palette, templates);
      board[row].push(cell.value);
      confidence[row].push(cell.confidence);
    }
  }
  return { board, confidence, palette: located.palette.id };
}
