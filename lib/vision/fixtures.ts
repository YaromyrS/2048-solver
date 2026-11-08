import type { Board } from '@/lib/game/board';

/**
 * Screenshots in __fixtures__ with the board each one shows (rows top to
 * bottom). The classic ones are the original open-source game (MIT,
 * gabrielecirulli/2048) with the board injected through its saved state, so
 * every value is known exactly. The play2048 ones redraw play2048.co's own
 * SVG tile/board textures with its layout and text style (Rubik 500), since
 * its canvas renderer can't be given an arbitrary board.
 */
export interface Fixture {
  file: string;
  palette: 'classic' | 'play2048-light' | 'play2048-dark';
  board: Board;
}

export const FIXTURES: readonly Fixture[] = [
  {
    file: 'classic-a.png',
    palette: 'classic',
    board: [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 4096],
      [0, 0, 8192, 0],
    ],
  },
  {
    file: 'classic-b.png',
    palette: 'classic',
    board: [
      [16384, 8192, 4096, 2048],
      [32768, 65536, 131072, 2],
      [4, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  {
    file: 'classic-c.png',
    palette: 'classic',
    board: [
      [1024, 512, 256, 128],
      [8, 16, 32, 64],
      [4, 2, 0, 0],
      [2, 0, 0, 0],
    ],
  },
  {
    file: 'classic-d.png',
    palette: 'classic',
    board: [
      [2, 2, 4, 8],
      [0, 16, 32, 0],
      [128, 0, 0, 512],
      [256, 1024, 0, 64],
    ],
  },
  {
    file: 'play2048-light-a.png',
    palette: 'play2048-light',
    board: [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 4096],
      [0, 0, 8192, 0],
    ],
  },
  {
    file: 'play2048-light-b.png',
    palette: 'play2048-light',
    board: [
      [16384, 8192, 4096, 2048],
      [32768, 65536, 131072, 2],
      [4, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  {
    file: 'play2048-light-c.png',
    palette: 'play2048-light',
    board: [
      [4, 8, 16, 32],
      [2048, 1024, 512, 256],
      [64, 128, 0, 2],
      [0, 4096, 2, 0],
    ],
  },
  {
    file: 'play2048-dark-a.png',
    palette: 'play2048-dark',
    board: [
      [1024, 512, 256, 128],
      [8, 16, 32, 64],
      [4, 2, 0, 0],
      [2, 0, 0, 0],
    ],
  },
  {
    file: 'play2048-dark-b.png',
    palette: 'play2048-dark',
    board: [
      [2, 2, 4, 8],
      [0, 16, 32, 0],
      [128, 0, 0, 512],
      [256, 1024, 0, 64],
    ],
  },
  {
    // A real capture of play2048.co's own (WebGL) renderer, read by eye.
    file: 'play2048-real-a.png',
    palette: 'play2048-light',
    board: [
      [2, 0, 0, 0],
      [4, 8, 4, 2],
      [8, 4, 2, 8],
      [16, 64, 32, 16],
    ],
  },
];
