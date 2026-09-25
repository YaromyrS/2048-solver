import { colorDistance, rgbAt, type RGBAImage, type Rect } from '@/lib/vision/image';
import { PALETTES, type Palette } from '@/lib/vision/palettes';

export interface LocatedBoard {
  rect: Rect;
  palette: Palette;
}

/** Work on a grid of at most this many samples per side, for speed. */
const ANALYSIS_SIZE = 400;
/** How close a pixel must be to a palette's board colour to count as "board". */
const BOARD_TOLERANCE = 40;
/** Smallest board worth reading, in analysis samples per side. */
const MIN_SIDE = 24;

/**
 * Find the 2048 board in a screenshot.
 *
 * The frame and the gaps between cells share one colour and form a connected
 * lattice, so the board is the largest square-ish connected region of that
 * colour whose interior shows the 4×4 gap lines. The gap check rejects solid
 * shapes of the same colour, such as the classic score boxes.
 */
export function locateBoard(img: RGBAImage): LocatedBoard | null {
  const step = Math.max(1, Math.ceil(Math.max(img.width, img.height) / ANALYSIS_SIZE));
  const cols = Math.floor(img.width / step);
  const rows = Math.floor(img.height / step);

  let best: (LocatedBoard & { size: number }) | null = null;
  for (const palette of PALETTES) {
    const mask = new Uint8Array(cols * rows);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = rgbAt(img, c * step, r * step);
        if (palette.board.some((color) => colorDistance(px, color) < BOARD_TOLERANCE)) mask[r * cols + c] = 1;
      }
    }
    for (const region of connectedRegions(mask, cols, rows)) {
      const { minC, minR, maxC, maxR, size } = region;
      const w = maxC - minC + 1;
      const h = maxR - minR + 1;
      if (w < MIN_SIDE || h < MIN_SIDE || w / h < 0.85 || w / h > 1.18) continue;
      if (!hasGapLines(mask, cols, region) || !hasCellInteriors(mask, cols, region)) continue;
      if (!best || size > best.size) {
        best = {
          palette,
          size,
          rect: { x: minC * step, y: minR * step, width: w * step, height: h * step },
        };
      }
    }
  }
  return best && { rect: refineEdges(img, best.rect, best.palette, step), palette: best.palette };
}

/**
 * The coarse search samples every `step`-th pixel, so each edge can be off by
 * up to `step`. Pin each edge to the outermost full-resolution line (within
 * `step` of the coarse one) that is still mostly board-coloured.
 */
function refineEdges(img: RGBAImage, rect: Rect, palette: Palette, step: number): Rect {
  if (step === 1) return rect;
  const isBoard = (x: number, y: number) =>
    palette.board.some((color) => colorDistance(rgbAt(img, x, y), color) < BOARD_TOLERANCE);
  const columnIsBoard = (x: number) => {
    let hits = 0;
    let total = 0;
    for (let y = rect.y; y < rect.y + rect.height; y += 2, total++) hits += isBoard(x, y) ? 1 : 0;
    return hits / total > 0.5;
  };
  const rowIsBoard = (y: number) => {
    let hits = 0;
    let total = 0;
    for (let x = rect.x; x < rect.x + rect.width; x += 2, total++) hits += isBoard(x, y) ? 1 : 0;
    return hits / total > 0.5;
  };
  const clampX = (x: number) => Math.min(img.width - 1, Math.max(0, x));
  const clampY = (y: number) => Math.min(img.height - 1, Math.max(0, y));

  let left = rect.x;
  for (let x = clampX(rect.x - step); x <= rect.x + step; x++) if (columnIsBoard(x)) { left = x; break; }
  let right = rect.x + rect.width - 1;
  for (let x = clampX(rect.x + rect.width - 1 + step); x >= rect.x + rect.width - 1 - step; x--) if (columnIsBoard(x)) { right = x; break; }
  let top = rect.y;
  for (let y = clampY(rect.y - step); y <= rect.y + step; y++) if (rowIsBoard(y)) { top = y; break; }
  let bottom = rect.y + rect.height - 1;
  for (let y = clampY(rect.y + rect.height - 1 + step); y >= rect.y + rect.height - 1 - step; y--) if (rowIsBoard(y)) { bottom = y; break; }
  return { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
}

interface Region {
  minC: number;
  minR: number;
  maxC: number;
  maxR: number;
  size: number;
}

/** 4-connected regions of set cells in a row-major mask. */
function connectedRegions(mask: Uint8Array, cols: number, rows: number): Region[] {
  const seen = new Uint8Array(mask.length);
  const regions: Region[] = [];
  const stack: number[] = [];
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue;
    const region: Region = { minC: cols, minR: rows, maxC: 0, maxR: 0, size: 0 };
    seen[start] = 1;
    stack.push(start);
    while (stack.length > 0) {
      const i = stack.pop()!;
      const r = Math.floor(i / cols);
      const c = i - r * cols;
      region.size++;
      region.minC = Math.min(region.minC, c);
      region.maxC = Math.max(region.maxC, c);
      region.minR = Math.min(region.minR, r);
      region.maxR = Math.max(region.maxR, r);
      const neighbours = [c > 0 ? i - 1 : -1, c < cols - 1 ? i + 1 : -1, r > 0 ? i - cols : -1, r < rows - 1 ? i + cols : -1];
      for (const n of neighbours) {
        if (n >= 0 && mask[n] && !seen[n]) {
          seen[n] = 1;
          stack.push(n);
        }
      }
    }
    regions.push(region);
  }
  return regions;
}

/** True when most of the 16 cell centres are not board-coloured (tiles or empty cells sit there). */
function hasCellInteriors(mask: Uint8Array, cols: number, region: Region): boolean {
  const w = region.maxC - region.minC + 1;
  const h = region.maxR - region.minR + 1;
  let interiors = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const c = region.minC + Math.round(((j + 0.5) * w) / 4);
      const r = region.minR + Math.round(((i + 0.5) * h) / 4);
      if (!mask[r * cols + c]) interiors++;
    }
  }
  return interiors >= 14;
}

/**
 * True when the three inner gap lines (between cell columns and between cell
 * rows) are mostly board-coloured. The exact gap position differs between
 * versions, so each line is searched for in a small band around the quarter.
 */
function hasGapLines(mask: Uint8Array, cols: number, region: Region): boolean {
  const w = region.maxC - region.minC + 1;
  const h = region.maxR - region.minR + 1;
  const band = Math.max(1, Math.round(w * 0.03));
  const lineCoverage = (vertical: boolean, at: number) => {
    let hits = 0;
    const length = vertical ? h : w;
    for (let t = 0; t < length; t++) {
      const c = vertical ? at : region.minC + t;
      const r = vertical ? region.minR + t : at;
      hits += mask[r * cols + c];
    }
    return hits / length;
  };
  for (const vertical of [true, false]) {
    const origin = vertical ? region.minC : region.minR;
    const span = vertical ? w : h;
    for (let k = 1; k <= 3; k++) {
      const centre = origin + Math.round((span * k) / 4);
      let bestCoverage = 0;
      for (let at = centre - band; at <= centre + band; at++) bestCoverage = Math.max(bestCoverage, lineCoverage(vertical, at));
      if (bestCoverage < 0.6) return false;
    }
  }
  return true;
}
