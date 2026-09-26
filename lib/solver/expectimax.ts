/**
 * Expectimax search for 2048.
 *
 * 2048's "opponent" is not adversarial — after each swipe a tile spawns at
 * random (a 2 with probability 0.9, a 4 with probability 0.1, uniformly over
 * the empty cells). Expectimax models that correctly: the player picks the move
 * with the best *expected* value, averaging over every possible spawn.
 *
 *   max node    → the player chooses the swipe maximising expected value
 *   chance node → nature spawns a random tile; we average over the outcomes
 *
 * Leaves are scored with the ported nneonneo heuristic. Search is bounded three
 * ways so a single suggestion always returns quickly (AC6): a depth limit that
 * adapts to board complexity, a cumulative-probability cutoff that abandons
 * vanishingly-unlikely branches, and a hard node budget as a backstop.
 *
 * Two implementations search the same tree with the same parameters
 * (searchConfig.ts): the packed-row one in bitboard.ts, used for every board
 * it can hold, and the plain-array one below, kept for boards near 65536
 * (which don't fit 4-bit ranks) and as the reference the bitboard is tested
 * against.
 */

import {
  DIRECTIONS,
  SIZE,
  applyMove,
  emptyCells,
  legalMoves,
  placeTile,
  type Board,
  type Direction,
} from '@/lib/game/board';
import { bitboardBestMove, canUseBitboard } from '@/lib/solver/bitboard';
import { heuristicScore } from '@/lib/solver/heuristics';
import {
  adaptiveDepth,
  ENDING_TILE_PENALTY,
  GAME_OVER_SCORE,
  NODE_BUDGET,
  PROB_THRESHOLD,
  SPAWNS,
} from '@/lib/solver/searchConfig';

export interface MoveSuggestion {
  direction: Direction;
  /** Expected heuristic value of the resulting position (for debugging/tests). */
  score: number;
}

/** Extra knobs for the search. */
export interface SolveOptions {
  /**
   * Largest tile the solver is allowed to form. Anything bigger is treated as a
   * terminal loss (the game ends the moment that tile appears): the solver
   * steers away from lines that pass the cap and never *suggests* a move that
   * does — unless every legal move does. `null`/`undefined` means no cap.
   */
  maxTile?: number | null;
}

/** True if any cell exceeds the tile cap — i.e. holds a game-ending tile. */
function exceedsCap(board: Board, maxTile: number): boolean {
  for (const row of board) {
    for (const v of row) {
      if (v > maxTile) return true;
    }
  }
  return false;
}

interface SearchContext {
  cache: Map<string, number>;
  nodes: number;
  /** Largest allowed tile; `Infinity` when no cap is set. */
  maxTile: number;
}

/** Compact key for the transposition cache: one char per cell rank. */
function boardKey(board: Board): string {
  let s = '';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[r][c];
      s += String.fromCharCode(v === 0 ? 0 : Math.log2(v));
    }
  }
  return s;
}

/** Chance node: average the value over every possible random spawn. */
function chanceValue(board: Board, cumProb: number, depth: number, ctx: SearchContext): number {
  // Passing the tile cap ends the game: treat such a board as a terminal loss
  // so the search steers away from any line that leads into it.
  if (exceedsCap(board, ctx.maxTile)) return ENDING_TILE_PENALTY;
  if (depth <= 0 || cumProb < PROB_THRESHOLD || ctx.nodes >= NODE_BUDGET) {
    return heuristicScore(board);
  }
  const cells = emptyCells(board);
  const n = cells.length;
  if (n === 0) return heuristicScore(board);

  const key = boardKey(board) + String.fromCharCode(depth);
  const cached = ctx.cache.get(key);
  if (cached !== undefined) return cached;
  ctx.nodes++;

  let value = 0;
  for (const { row, col } of cells) {
    for (const [tileValue, prob] of SPAWNS) {
      const weight = prob / n;
      const child = placeTile(board, row, col, tileValue);
      value += weight * maxValue(child, cumProb * weight, depth, ctx);
    }
  }

  ctx.cache.set(key, value);
  return value;
}

/** Max node: the player takes the best available swipe (deterministic). */
function maxValue(board: Board, cumProb: number, depth: number, ctx: SearchContext): number {
  let best = -Infinity;
  for (const direction of DIRECTIONS) {
    const { board: next, moved } = applyMove(board, direction);
    if (!moved) continue;
    const value = chanceValue(next, cumProb, depth - 1, ctx);
    if (value > best) best = value;
  }
  // No legal move → game over. This is a loss, not a normal leaf: score it far
  // below any survivable position so the search never walks into a certain death
  // when a surviving move exists. See {@link GAME_OVER_SCORE}.
  return best === -Infinity ? GAME_OVER_SCORE : best;
}

/**
 * Suggest the best swipe for `board`, or `null` if the board is terminal
 * (no legal move — i.e. game over). Synchronous; the UI goes through the
 * worker-backed async entry point in client.ts instead.
 */
export function bestMove(board: Board, options: SolveOptions = {}): MoveSuggestion | null {
  const maxTile = options.maxTile ?? Infinity;
  return canUseBitboard(board) ? bitboardBestMove(board, maxTile) : arrayBestMove(board, options);
}

/**
 * The same search on plain arrays: slower, but holds any tile. Used for boards
 * the bitboard can't (tile sum near 65536) and as its reference in tests.
 */
export function arrayBestMove(board: Board, options: SolveOptions = {}): MoveSuggestion | null {
  const maxTile = options.maxTile ?? Infinity;
  const legal = legalMoves(board);
  if (legal.length === 0) return null;

  const depth = adaptiveDepth(board);
  const ctx: SearchContext = { cache: new Map(), nodes: 0, maxTile };

  let bestDirection = legal[0];
  let bestScore = -Infinity;
  // With a cap set, prefer the best move that stays within it; only fall back
  // to a cap-breaking move when every legal move breaks it (truly forced).
  let bestSafeDirection: Direction | null = null;
  let bestSafeScore = -Infinity;

  for (const direction of legal) {
    const { board: next } = applyMove(board, direction);
    const score = chanceValue(next, 1, depth, ctx);
    if (score > bestScore) {
      bestScore = score;
      bestDirection = direction;
    }
    if (!exceedsCap(next, maxTile) && score > bestSafeScore) {
      bestSafeScore = score;
      bestSafeDirection = direction;
    }
  }

  if (maxTile !== Infinity && bestSafeDirection !== null) {
    return { direction: bestSafeDirection, score: bestSafeScore };
  }
  return { direction: bestDirection, score: bestScore };
}
