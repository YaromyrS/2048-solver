import { hexToRgb, type RGB } from '@/lib/vision/image';

export type PaletteId = 'classic' | 'play2048-light' | 'play2048-dark';

/** How one version of 2048 colours its board. */
export interface Palette {
  id: PaletteId;
  /** The frame around the board and the gaps between cells. */
  board: readonly RGB[];
  /** An empty cell. */
  empty: RGB;
  /** Tile colour by value, as read by `tileColor` (mean of its top and bottom bands). */
  tiles: ReadonlyMap<number, RGB>;
  /** Shared colour of every tile above the largest one in `tiles`. */
  overflow: RGB;
}

/** play2048.co draws the same tiles on its light and dark boards. */
const PLAY2048_TILES = new Map<number, RGB>([
  [2, [238, 228, 218]],
  [4, [235, 216, 182]],
  [8, [242, 176, 117]],
  [16, [246, 146, 95]],
  [32, [246, 123, 94]],
  [64, [246, 96, 61]],
  [128, [241, 209, 96]],
  [256, [243, 207, 84]],
  [512, [246, 206, 70]],
  [1024, [249, 204, 57]],
  [2048, [255, 200, 18]],
]);

/**
 * Colours measured from the screenshots in __fixtures__.
 *
 * - classic: the original open-source game (gabrielecirulli/2048) and the many
 *   copies that reuse its stylesheet. Flat colours straight from its CSS.
 * - play2048: the current play2048.co, which draws gradient tiles from SVG
 *   textures and has light and dark boards.
 */
export const PALETTES: readonly Palette[] = [
  {
    id: 'classic',
    board: [hexToRgb('#bbada0')],
    empty: [205, 193, 180],
    tiles: new Map<number, RGB>([
      [2, [238, 228, 218]],
      [4, [237, 224, 200]],
      [8, [242, 177, 121]],
      [16, [245, 149, 99]],
      [32, [246, 124, 95]],
      [64, [246, 94, 59]],
      [128, [237, 207, 114]],
      [256, [237, 204, 97]],
      [512, [237, 200, 80]],
      [1024, [237, 197, 63]],
      [2048, [237, 194, 46]],
    ]),
    overflow: [60, 58, 50],
  },
  {
    id: 'play2048-light',
    board: [hexToRgb('#998c7e'), hexToRgb('#988776')],
    empty: [190, 173, 152],
    tiles: PLAY2048_TILES,
    overflow: [58, 51, 43],
  },
  {
    id: 'play2048-dark',
    board: [hexToRgb('#54514a'), hexToRgb('#504c44')],
    empty: [110, 103, 91],
    tiles: PLAY2048_TILES,
    overflow: [58, 51, 43],
  },
];
