/**
 * Core 2048 board mechanics — pure, deterministic, no randomness.
 *
 * This module is the single source of truth for how tiles slide and merge.
 * The solver and the UI both build on it, so correctness here is critical
 * (see AC1–AC4 in the spec). Deliberately free of any random-spawn logic:
 * the human tells us where the real game placed a tile.
 */

export const SIZE = 4;

/** A single cell: 0 means empty, otherwise the tile's face value (2, 4, 8, …). */
export type Cell = number;

/** Row-major 4×4 grid: `board[row][col]`. */
export type Board = Cell[][];

export type Direction = 'up' | 'down' | 'left' | 'right';

export const DIRECTIONS: readonly Direction[] = ['up', 'down', 'left', 'right'];

export interface Position {
  row: number;
  col: number;
}

/** Result of sliding the whole board one direction. */
export interface MoveResult {
  board: Board;
  /** True when the move actually changed the board (i.e. it is a legal move). */
  moved: boolean;
  /** Points gained this move: the sum of every merged tile's new value. */
  gained: number;
}

export function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array<Cell>(SIZE).fill(0));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.slice());
}

export function boardsEqual(a: Board, b: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

export function emptyCells(board: Board): Position[] {
  const cells: Position[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) cells.push({ row: r, col: c });
    }
  }
  return cells;
}

export function countEmpty(board: Board): number {
  let n = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) n++;
    }
  }
  return n;
}

export function maxTile(board: Board): number {
  let m = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] > m) m = board[r][c];
    }
  }
  return m;
}

/**
 * Place a tile on an empty cell, returning a new board. Throws if the target
 * cell is occupied — callers must only ever place on a genuinely free cell,
 * so an occupied cell signals a real bug rather than something to paper over.
 */
export function placeTile(board: Board, row: number, col: number, value: Cell): Board {
  if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
    throw new RangeError(`placeTile: (${row}, ${col}) is outside the ${SIZE}×${SIZE} board`);
  }
  if (board[row][col] !== 0) {
    throw new Error(`placeTile: cell (${row}, ${col}) is already occupied by ${board[row][col]}`);
  }
  const next = cloneBoard(board);
  next[row][col] = value;
  return next;
}

/**
 * Set a cell to an arbitrary value, overwriting whatever is there (0 clears the
 * cell). Unlike {@link placeTile}, this permits overwrite — it backs the manual
 * board editor where the user reconstructs an in-progress game and may correct
 * earlier entries. Still range-checked, because an off-board index is a bug.
 */
export function setCell(board: Board, row: number, col: number, value: Cell): Board {
  if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
    throw new RangeError(`setCell: (${row}, ${col}) is outside the ${SIZE}×${SIZE} board`);
  }
  const next = cloneBoard(board);
  next[row][col] = value;
  return next;
}

/**
 * Slide + merge a single line toward index 0 (the "left" primitive).
 * A tile may merge at most once per move (standard 2048 rule).
 */
function slideLine(line: Cell[]): { line: Cell[]; gained: number } {
  const tiles = line.filter((v) => v !== 0);
  const out: Cell[] = [];
  let gained = 0;

  for (let i = 0; i < tiles.length; i++) {
    if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
      const merged = tiles[i] * 2;
      out.push(merged);
      gained += merged;
      i++; // consume the partner so it can't merge again
    } else {
      out.push(tiles[i]);
    }
  }
  while (out.length < SIZE) out.push(0);
  return { line: out, gained };
}

function transpose(board: Board): Board {
  const out = emptyBoard();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      out[c][r] = board[r][c];
    }
  }
  return out;
}

function reverseRows(board: Board): Board {
  return board.map((row) => row.slice().reverse());
}

/**
 * Apply a swipe. Every direction is expressed in terms of the "slide left"
 * primitive by transforming the board into that frame and back:
 *   left  : slide as-is
 *   right : mirror → slide → mirror
 *   up    : transpose → slide → transpose
 *   down  : transpose → mirror → slide → mirror → transpose
 * No random tile is spawned — the after-board is purely deterministic (AC3).
 */
export function applyMove(board: Board, direction: Direction): MoveResult {
  let work = board;
  if (direction === 'right') work = reverseRows(work);
  else if (direction === 'up') work = transpose(work);
  else if (direction === 'down') work = reverseRows(transpose(work));

  let gained = 0;
  const slid = work.map((line) => {
    const res = slideLine(line);
    gained += res.gained;
    return res.line;
  });

  let result = slid;
  if (direction === 'right') result = reverseRows(result);
  else if (direction === 'up') result = transpose(result);
  else if (direction === 'down') result = transpose(reverseRows(result));

  return { board: result, moved: !boardsEqual(board, result), gained };
}

/** Directions that would actually change the board. */
export function legalMoves(board: Board): Direction[] {
  return DIRECTIONS.filter((d) => applyMove(board, d).moved);
}

/** True while at least one legal move exists (an empty cell or an adjacent pair). */
export function hasMoves(board: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[r][c];
      if (v === 0) return true;
      if (c + 1 < SIZE && board[r][c + 1] === v) return true;
      if (r + 1 < SIZE && board[r + 1][c] === v) return true;
    }
  }
  return false;
}

/** Game over ⇔ no legal move remains (board full and no adjacent equals — AC4). */
export function isGameOver(board: Board): boolean {
  return !hasMoves(board);
}
