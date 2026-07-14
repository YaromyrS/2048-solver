import { describe, expect, it } from 'vitest';
import {
  type Board,
  type Direction,
  applyMove,
  countEmpty,
  emptyCells,
  isGameOver,
  legalMoves,
  placeTile,
} from '@/lib/game/board';
import { bestMove } from '@/lib/solver/expectimax';

function b(rows: number[][]): Board {
  return rows.map((r) => r.slice());
}

/** True if the board resulting from `direction` contains a 2048 (or larger) tile. */
function moveForms2048(board: Board, direction: Direction): boolean {
  return applyMove(board, direction).board.some((row) => row.some((v) => v >= 2048));
}

/**
 * True if `direction` leads to game over no matter what spawns next: every empty
 * cell, filled with either a 2 or a 4, leaves a board with no legal move.
 */
function isGuaranteedLoss(board: Board, direction: Direction): boolean {
  const { board: after, moved } = applyMove(board, direction);
  if (!moved) return false;
  const cells = emptyCells(after);
  if (cells.length === 0) return isGameOver(after);
  for (const { row, col } of cells) {
    for (const value of [2, 4]) {
      if (!isGameOver(placeTile(after, row, col, value))) return false;
    }
  }
  return true;
}

describe('bestMove', () => {
  it('returns null for a terminal (game-over) board', () => {
    const gridlocked = b([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ]);
    expect(bestMove(gridlocked)).toBeNull();
  });

  it('always suggests a legal move (AC2)', () => {
    const board = b([
      [2, 0, 0, 4],
      [0, 8, 0, 0],
      [0, 0, 2, 0],
      [16, 0, 0, 2],
    ]);
    const suggestion = bestMove(board);
    expect(suggestion).not.toBeNull();
    expect(legalMoves(board)).toContain(suggestion!.direction);
    // A legal move by definition changes the board.
    expect(applyMove(board, suggestion!.direction).moved).toBe(true);
  });

  it('is deterministic — no randomness in the search', () => {
    const board = b([
      [2, 0, 4, 0],
      [0, 2, 0, 8],
      [4, 0, 2, 0],
      [0, 0, 0, 2],
    ]);
    const first = bestMove(board);
    const second = bestMove(board);
    expect(first).toEqual(second);
  });

  it('merges to free space when the board is full', () => {
    // A full board has no empty cell, so the only moves that change anything
    // are merges. Whatever the solver picks must therefore open up space —
    // i.e. it never suggests a no-op and never walks straight into game over
    // when a merge is available.
    const full = b([
      [2, 2, 4, 8],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, 128],
    ]);
    expect(countEmpty(full)).toBe(0);
    const suggestion = bestMove(full);
    expect(suggestion).not.toBeNull();
    const after = applyMove(full, suggestion!.direction);
    expect(after.moved).toBe(true);
    expect(countEmpty(after.board)).toBeGreaterThan(0);
  });

  it('never suggests a certain-death move when a survivable one exists', () => {
    // Real board from a bug report: sliding LEFT leaves a single gap that any
    // spawn (2 or 4) gridlocks — a guaranteed loss — while UP keeps two 8s
    // mergeable and survives. The solver must not pick the certain death.
    const board = b([
      [0, 1024, 2, 32],
      [2, 16, 64, 128],
      [4, 8, 32, 512],
      [8, 4, 8, 1024],
    ]);
    expect(isGuaranteedLoss(board, 'left')).toBe(true);
    expect(isGuaranteedLoss(board, 'up')).toBe(false);

    for (const avoid2048 of [false, true]) {
      const suggestion = bestMove(board, { avoid2048 });
      expect(suggestion).not.toBeNull();
      expect(isGuaranteedLoss(board, suggestion!.direction)).toBe(false);
    }
  });
});

describe('bestMove — avoid2048', () => {
  // Merging left or right forms 2048; sliding down keeps the two 1024s apart.
  const nearWin = b([
    [1024, 1024, 0, 0],
    [2, 4, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  it('picks a move that does not form 2048 when one exists', () => {
    const suggestion = bestMove(nearWin, { avoid2048: true });
    expect(suggestion).not.toBeNull();
    expect(moveForms2048(nearWin, suggestion!.direction)).toBe(false);
    // Down is the only safe move here.
    expect(suggestion!.direction).toBe('down');
  });

  it('is free to form 2048 when avoidance is off (default)', () => {
    // Sanity check that the guard is opt-in: default behaviour is unchanged, and
    // passing avoid2048:false is equivalent to passing nothing.
    expect(bestMove(nearWin, { avoid2048: false })).toEqual(bestMove(nearWin));
  });

  it('still returns a legal move when every option forms 2048 (forced)', () => {
    // Only left and right are legal, and both merge the 1024s into 2048.
    const forced = b([
      [1024, 1024, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
    ]);
    expect(legalMoves(forced)).toEqual(expect.arrayContaining(['left', 'right']));
    expect(legalMoves(forced)).not.toContain('up');
    expect(legalMoves(forced)).not.toContain('down');

    const suggestion = bestMove(forced, { avoid2048: true });
    expect(suggestion).not.toBeNull();
    expect(legalMoves(forced)).toContain(suggestion!.direction);
    // No way out: the forced suggestion does form 2048.
    expect(moveForms2048(forced, suggestion!.direction)).toBe(true);
  });
});
