import { describe, expect, it } from 'vitest';
import { applyMove, emptyBoard, emptyCells, placeTile, type Board } from '@/lib/game/board';
import { bitboardBestMove, canUseBitboard } from '@/lib/solver/bitboard';
import { arrayBestMove, bestMove } from '@/lib/solver/expectimax';

/** mulberry32: small seeded PRNG so every generated board is reproducible. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A random board with 2 … maxTiles tiles, skewed toward small values (2 … 4096). */
function randomBoard(rand: () => number, maxTiles: number): Board {
  let board = emptyBoard();
  const tiles = 2 + Math.floor(rand() * (maxTiles - 1));
  for (let k = 0; k < tiles; k++) {
    const cells = emptyCells(board);
    const { row, col } = cells[Math.floor(rand() * cells.length)];
    const rank = 1 + Math.floor(rand() * rand() * 12);
    board = placeTile(board, row, col, 2 ** rank);
  }
  return board;
}

const CAPS = [Infinity, 1024, 2048, 512];

/**
 * The array search takes up to ~3 s on a crowded board, and these tests run
 * before every deploy, so by default they compare a quick sample: 20 boards of
 * up to 9 tiles. For a thorough check, raise the sample:
 *   SOLVER_DIFF_BOARDS=300 npx vitest run lib/solver/bitboard.test.ts
 */
const DIFF_BOARDS = Number(process.env.SOLVER_DIFF_BOARDS ?? 20);
const DIFF_MAX_TILES = process.env.SOLVER_DIFF_BOARDS ? 15 : 9;

describe('bitboard search', () => {
  it('matches the array search exactly on random boards', () => {
    const rand = rng(2048);
    for (let i = 0; i < DIFF_BOARDS; i++) {
      const board = randomBoard(rand, DIFF_MAX_TILES);
      const cap = CAPS[i % CAPS.length];
      const expected = arrayBestMove(board, { maxTile: cap === Infinity ? null : cap });
      expect(bitboardBestMove(board, cap), JSON.stringify({ board, cap })).toEqual(expected);
    }
  }, 3_600_000);

  it('matches the array search exactly along a played game', () => {
    const rand = rng(7);
    const spawn = (b: Board) => {
      const cells = emptyCells(b);
      const { row, col } = cells[Math.floor(rand() * cells.length)];
      return placeTile(b, row, col, rand() < 0.9 ? 2 : 4);
    };
    let board = spawn(spawn(emptyBoard()));
    for (let move = 0; move < 150; move++) {
      const fast = bitboardBestMove(board, Infinity);
      if (move % 60 === 0) expect(fast, `move ${move}: ${JSON.stringify(board)}`).toEqual(arrayBestMove(board));
      if (!fast) break;
      board = spawn(applyMove(board, fast.direction).board);
    }
  }, 120_000);

  it('returns null for a board with no legal move', () => {
    const dead: Board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(bitboardBestMove(dead, Infinity)).toBeNull();
  });
});

describe('canUseBitboard', () => {
  it('admits ordinary boards, including a 32768', () => {
    expect(canUseBitboard([[32768, 16384, 8192, 4096], [0, 0, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0]])).toBe(true);
  });

  it('refuses a tile that does not fit four bits', () => {
    expect(canUseBitboard([[65536, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 2]])).toBe(false);
  });

  it('refuses boards whose tile sum could reach 65536 during the search', () => {
    // 32768 + 16384 + 8192 + 4096 + 2048 + 1024 + 512 + 256 + 128 + 64 + 32 + 16 = 65520:
    // five spawns of 4 would make 65540, enough for a 65536 in principle.
    const nearly: Board = [
      [32768, 16384, 8192, 4096],
      [128, 256, 512, 1024],
      [64, 32, 16, 2048],
      [0, 0, 0, 0],
    ];
    expect(canUseBitboard(nearly)).toBe(false);
    // 8 less (65512 + 20 = 65532) can never reach it, so it stays on the fast path.
    const safe = nearly.map((row) => row.map((v) => (v === 16 ? 8 : v)));
    expect(canUseBitboard(safe)).toBe(true);
  });

  it('falls back to the array search for such boards', () => {
    const board: Board = [
      [65536, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(bestMove(board)).toEqual(arrayBestMove(board));
  });
});
