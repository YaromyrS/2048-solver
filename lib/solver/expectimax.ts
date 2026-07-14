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
import { heuristicScore } from '@/lib/solver/heuristics';

export interface MoveSuggestion {
  direction: Direction;
  /** Expected heuristic value of the resulting position (for debugging/tests). */
  score: number;
}

/** Extra knobs for the search. */
export interface SolveOptions {
  /**
   * When true, forming the 2048 tile is treated as a terminal loss (this game
   * ends the moment 2048 appears). The solver steers away from lines that reach
   * it and never *suggests* a move that forms it — unless every legal move does.
   */
  avoid2048?: boolean;
}

/** Abandon a branch once the chance of actually reaching it drops below this. */
const PROB_THRESHOLD = 0.001;

/** Backstop so pathological positions can never hang the UI. */
const NODE_BUDGET = 200_000;

/** Possible spawns after a swipe: value and its probability. */
const SPAWNS: ReadonlyArray<readonly [value: number, prob: number]> = [
  [2, 0.9],
  [4, 0.1],
];

/**
 * The tile that ends the game. With {@link SolveOptions.avoid2048} on, any board
 * containing a tile ≥ this is scored as a terminal loss — capping play at 1024.
 */
const GAME_ENDING_TILE = 2048;

/**
 * Value for a board that has already formed the game-ending tile: far below any
 * real position's heuristic (which runs in the millions), so the search always
 * prefers any non-ending continuation over it.
 */
const ENDING_TILE_PENALTY = -1e9;

/**
 * Score for a board with no legal move — i.e. game over. Every survivable leaf
 * scores in the millions (the {@link heuristicScore} baseline; see
 * SCORE_LOST_PENALTY in heuristics.ts), so scoring a dead board 0 — as nneonneo
 * does — makes reaching game over a decisive loss the search steers away from
 * whenever any surviving move exists. Scoring it with the static heuristic
 * instead (which still carries that positive baseline) let a tidy dead board
 * outscore a messy but *alive* one, so the solver could walk into a certain loss.
 */
const GAME_OVER_SCORE = 0;

/** True if any cell holds the game-ending tile (or larger). */
function reachesEndingTile(board: Board): boolean {
  for (const row of board) {
    for (const v of row) {
      if (v >= GAME_ENDING_TILE) return true;
    }
  }
  return false;
}

interface SearchContext {
  cache: Map<string, number>;
  nodes: number;
  avoid2048: boolean;
}

/**
 * Look further ahead when the board is more developed (more distinct tile
 * values) and stay shallow early on, where branching is wide but shallow search
 * already plays well. Clamped to keep the worst case fast.
 */
function adaptiveDepth(board: Board): number {
  const seen = new Set<number>();
  for (const row of board) {
    for (const v of row) {
      if (v !== 0) seen.add(v);
    }
  }
  return Math.min(5, Math.max(3, seen.size - 2));
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
  // Forming 2048 ends the game: treat such a board as a terminal loss so the
  // search steers away from any line that leads into it.
  if (ctx.avoid2048 && reachesEndingTile(board)) return ENDING_TILE_PENALTY;
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
 * (no legal move — i.e. game over). Synchronous; see {@link computeBestMove}
 * for the async entry point the UI uses.
 */
export function bestMove(board: Board, options: SolveOptions = {}): MoveSuggestion | null {
  const avoid2048 = options.avoid2048 ?? false;
  const legal = legalMoves(board);
  if (legal.length === 0) return null;

  const depth = adaptiveDepth(board);
  const ctx: SearchContext = { cache: new Map(), nodes: 0, avoid2048 };

  let bestDirection = legal[0];
  let bestScore = -Infinity;
  // With avoidance on, prefer the best move that does *not* form 2048; only fall
  // back to a 2048-forming move when every legal move forms one (truly forced).
  let bestSafeDirection: Direction | null = null;
  let bestSafeScore = -Infinity;

  for (const direction of legal) {
    const { board: next } = applyMove(board, direction);
    const score = chanceValue(next, 1, depth, ctx);
    if (score > bestScore) {
      bestScore = score;
      bestDirection = direction;
    }
    if (avoid2048 && !reachesEndingTile(next) && score > bestSafeScore) {
      bestSafeScore = score;
      bestSafeDirection = direction;
    }
  }

  if (avoid2048 && bestSafeDirection !== null) {
    return { direction: bestSafeDirection, score: bestSafeScore };
  }
  return { direction: bestDirection, score: bestScore };
}

/**
 * Async wrapper around {@link bestMove}. Kept async so the computation can later
 * be moved to a Web Worker without touching any call sites.
 */
export function computeBestMove(
  board: Board,
  options: SolveOptions = {},
): Promise<MoveSuggestion | null> {
  return Promise.resolve(bestMove(board, options));
}
