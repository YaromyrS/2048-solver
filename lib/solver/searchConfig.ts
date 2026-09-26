/**
 * Search parameters shared by both expectimax implementations (the packed
 * bitboard one used for almost every board, and the array-based fallback), so
 * they always search exactly the same tree.
 */

import type { Board } from '@/lib/game/board';

/** Abandon a branch once the chance of actually reaching it drops below this. */
export const PROB_THRESHOLD = 0.001;

/** Backstop so pathological positions can never hang the UI. */
export const NODE_BUDGET = 200_000;

/** Deepest search `adaptiveDepth` ever asks for. */
export const MAX_DEPTH = 5;

/** Possible spawns after a swipe: value and its probability. */
export const SPAWNS: ReadonlyArray<readonly [value: number, prob: number]> = [
  [2, 0.9],
  [4, 0.1],
];

/**
 * Value for a board that has already passed the tile cap: far below any real
 * position's heuristic (which runs in the millions), so the search always
 * prefers any within-cap continuation over it.
 */
export const ENDING_TILE_PENALTY = -1e9;

/**
 * Score for a board with no legal move — i.e. game over. Every survivable leaf
 * scores in the millions (the heuristic's baseline; see SCORE_LOST_PENALTY in
 * heuristics.ts), so scoring a dead board 0 — as nneonneo does — makes reaching
 * game over a decisive loss the search steers away from whenever any surviving
 * move exists. Scoring it with the static heuristic instead (which still
 * carries that positive baseline) let a tidy dead board outscore a messy but
 * *alive* one, so the solver could walk into a certain loss.
 */
export const GAME_OVER_SCORE = 0;

/**
 * Look further ahead when the board is more developed (more distinct tile
 * values) and stay shallow early on, where branching is wide but shallow search
 * already plays well. Clamped to keep the worst case fast.
 */
export function adaptiveDepth(board: Board): number {
  const seen = new Set<number>();
  for (const row of board) {
    for (const v of row) {
      if (v !== 0) seen.add(v);
    }
  }
  return Math.min(MAX_DEPTH, Math.max(3, seen.size - 2));
}
