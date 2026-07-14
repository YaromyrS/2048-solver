import { describe, expect, it } from 'vitest';
import {
  type Board,
  applyMove,
  boardsEqual,
  emptyBoard,
  hasMoves,
  isGameOver,
  legalMoves,
  placeTile,
  setCell,
} from '@/lib/game/board';

/** Terse board literal for tests. */
function b(rows: number[][]): Board {
  return rows.map((r) => r.slice());
}

describe('applyMove — sliding & merging', () => {
  it('merges a pair to the left and reports points gained', () => {
    const { board, moved, gained } = applyMove(
      b([
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      'left',
    );
    expect(board[0]).toEqual([4, 0, 0, 0]);
    expect(moved).toBe(true);
    expect(gained).toBe(4);
  });

  it('merges only the leftmost pair, never three in a row', () => {
    const { board } = applyMove(
      b([
        [2, 2, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      'left',
    );
    expect(board[0]).toEqual([4, 2, 0, 0]);
  });

  it('does not merge an already-merged tile again in the same move', () => {
    const { board, gained } = applyMove(
      b([
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      'left',
    );
    expect(board[0]).toEqual([4, 4, 0, 0]);
    expect(gained).toBe(8);
  });

  it('slides and merges to the right', () => {
    const { board } = applyMove(
      b([
        [0, 0, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      'right',
    );
    expect(board[0]).toEqual([0, 0, 0, 4]);
  });

  it('slides and merges upward within a column', () => {
    const { board } = applyMove(
      b([
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [4, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      'up',
    );
    expect(board.map((row) => row[0])).toEqual([4, 4, 0, 0]);
  });

  it('slides and merges downward within a column', () => {
    const { board } = applyMove(
      b([
        [0, 0, 0, 0],
        [4, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 0, 0, 0],
      ]),
      'down',
    );
    expect(board.map((row) => row[0])).toEqual([0, 0, 4, 4]);
  });

  it('reports moved=false and no gain when nothing changes', () => {
    const before = b([
      [2, 4, 8, 16],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, 128],
    ]);
    const { board, moved, gained } = applyMove(before, 'left');
    expect(moved).toBe(false);
    expect(gained).toBe(0);
    expect(boardsEqual(board, before)).toBe(true);
  });

  it('does not mutate the input board', () => {
    const before = b([
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    applyMove(before, 'left');
    expect(before[0]).toEqual([2, 2, 0, 0]);
  });
});

describe('legalMoves', () => {
  it('excludes directions that leave the board unchanged', () => {
    // Two 2s in the top row (different columns): up is a no-op, the rest move.
    const moves = legalMoves(
      b([
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
    );
    expect(moves).not.toContain('up');
    expect(moves).toEqual(expect.arrayContaining(['left', 'right', 'down']));
  });
});

describe('placeTile', () => {
  it('places a tile on an empty cell without mutating the source', () => {
    const src = emptyBoard();
    const next = placeTile(src, 1, 2, 4);
    expect(next[1][2]).toBe(4);
    expect(src[1][2]).toBe(0);
  });

  it('throws when the target cell is occupied', () => {
    const board = placeTile(emptyBoard(), 0, 0, 2);
    expect(() => placeTile(board, 0, 0, 2)).toThrow();
  });

  it('throws when the target is off the board', () => {
    expect(() => placeTile(emptyBoard(), 4, 0, 2)).toThrow(RangeError);
  });
});

describe('setCell', () => {
  it('overwrites an occupied cell without mutating the source', () => {
    const src = placeTile(emptyBoard(), 1, 1, 2);
    const next = setCell(src, 1, 1, 8);
    expect(next[1][1]).toBe(8);
    expect(src[1][1]).toBe(2);
  });

  it('clears a cell when set to 0 (erase)', () => {
    const src = placeTile(emptyBoard(), 0, 0, 4);
    expect(setCell(src, 0, 0, 0)[0][0]).toBe(0);
  });

  it('throws when the target is off the board', () => {
    expect(() => setCell(emptyBoard(), 4, 0, 2)).toThrow(RangeError);
  });
});

describe('game-over detection', () => {
  const gridlocked = b([
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2],
  ]);

  it('is over when the board is full with no adjacent equals', () => {
    expect(hasMoves(gridlocked)).toBe(false);
    expect(isGameOver(gridlocked)).toBe(true);
  });

  it('is not over when an empty cell exists', () => {
    const withGap = b([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 0],
    ]);
    expect(isGameOver(withGap)).toBe(false);
  });

  it('is not over when a merge is available on a full board', () => {
    const mergeable = b([
      [2, 2, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ]);
    expect(isGameOver(mergeable)).toBe(false);
  });
});
