/**
 * Board evaluation — a faithful TypeScript port of nneonneo's proven 2048-ai
 * heuristic (https://github.com/nneonneo/2048-ai), implemented from its
 * documented weights rather than copied.
 *
 * The heuristic rewards: empty space, available merges, and monotonic rows /
 * columns (values consistently increasing toward a corner); it penalises the
 * total "weight" of large scattered tiles. It is evaluated per line of four
 * cells and summed over all rows and all columns.
 *
 * Values are scored by *rank* = log2(value) so that, e.g., an 8 (rank 3) and a
 * 16 (rank 4) differ by one step rather than by eight.
 */

import { SIZE, type Board } from '@/lib/game/board';

// Weights from nneonneo's reference implementation.
const SCORE_LOST_PENALTY = 200000.0;
const SCORE_MONOTONICITY_POWER = 4.0;
const SCORE_MONOTONICITY_WEIGHT = 47.0;
const SCORE_SUM_POWER = 3.5;
const SCORE_SUM_WEIGHT = 11.0;
const SCORE_MERGES_WEIGHT = 700.0;
const SCORE_EMPTY_WEIGHT = 270.0;

function rank(value: number): number {
  return value === 0 ? 0 : Math.log2(value);
}

// Memoise per-line scores: a line is four ranks (each a small integer), packed
// into one number. Powers-of-two tiles up to 2^19 keep every rank < 20.
const lineCache = new Map<number, number>();

function lineScore(r0: number, r1: number, r2: number, r3: number): number {
  const key = ((r0 * 20 + r1) * 20 + r2) * 20 + r3;
  const cached = lineCache.get(key);
  if (cached !== undefined) return cached;

  const ranks = [r0, r1, r2, r3];

  let sum = 0;
  let empty = 0;
  let merges = 0;
  let prev = 0;
  let counter = 0;

  for (const rk of ranks) {
    sum += Math.pow(rk, SCORE_SUM_POWER);
    if (rk === 0) {
      empty++;
    } else {
      if (prev === rk) {
        counter++;
      } else if (counter > 0) {
        merges += 1 + counter;
        counter = 0;
      }
      prev = rk;
    }
  }
  if (counter > 0) merges += 1 + counter;

  // Monotonicity: the cheaper of "decreasing left→right" vs "increasing
  // left→right". A line that already trends one way is barely penalised.
  let monoLeft = 0;
  let monoRight = 0;
  for (let i = 1; i < ranks.length; i++) {
    const a = ranks[i - 1];
    const b = ranks[i];
    if (a > b) {
      monoLeft += Math.pow(a, SCORE_MONOTONICITY_POWER) - Math.pow(b, SCORE_MONOTONICITY_POWER);
    } else {
      monoRight += Math.pow(b, SCORE_MONOTONICITY_POWER) - Math.pow(a, SCORE_MONOTONICITY_POWER);
    }
  }

  const score =
    SCORE_LOST_PENALTY +
    SCORE_EMPTY_WEIGHT * empty +
    SCORE_MERGES_WEIGHT * merges -
    SCORE_MONOTONICITY_WEIGHT * Math.min(monoLeft, monoRight) -
    SCORE_SUM_WEIGHT * sum;

  lineCache.set(key, score);
  return score;
}

/**
 * Full-board heuristic: the sum of the per-line score over every row and every
 * column. Higher is better. Used at the leaves of the expectimax search.
 */
export function heuristicScore(board: Board): number {
  // Precompute ranks once; rows and columns both read from this grid.
  const g: number[][] = board.map((row) => row.map(rank));

  let score = 0;
  for (let r = 0; r < SIZE; r++) {
    score += lineScore(g[r][0], g[r][1], g[r][2], g[r][3]);
  }
  for (let c = 0; c < SIZE; c++) {
    score += lineScore(g[0][c], g[1][c], g[2][c], g[3][c]);
  }
  return score;
}
