/**
 * Expectimax on a packed board: the same search as the array version in
 * expectimax.ts, many times faster.
 *
 * A row is 16 bits holding four 4-bit tile ranks (rank = log2 of the value,
 * 0 = empty), column 0 in the lowest nibble. Sliding a row and scoring it are
 * lookups in tables precomputed for all 65,536 rows, as nneonneo's C++ does;
 * up/down moves and column scores work on the transposed rows.
 *
 * Everything else mirrors the array search exactly — move order, spawn order,
 * cut-offs, node budget, cache — so both return identical moves and scores
 * (bitboard.test.ts checks this on random boards).
 *
 * Four bits hold ranks up to 15 (32768). `canUseBitboard` only admits boards
 * whose tile sum cannot reach 65536 anywhere in the search, so no tile ever
 * overflows its nibble.
 */

import { DIRECTIONS, SIZE, type Board, type Direction } from '@/lib/game/board';
import { lineScore } from '@/lib/solver/heuristics';
import {
  adaptiveDepth,
  ENDING_TILE_PENALTY,
  GAME_OVER_SCORE,
  MAX_DEPTH,
  NODE_BUDGET,
  PROB_THRESHOLD,
  SPAWNS,
} from '@/lib/solver/searchConfig';

export interface BitboardSuggestion {
  direction: Direction;
  score: number;
}

const ROW_COUNT = 1 << 16;
/** Largest rank a nibble holds (2^15 = 32768). */
const MAX_RANK = 15;

interface Tables {
  /** Row after sliding toward column 0 / toward column 3. */
  left: Uint16Array;
  right: Uint16Array;
  /** nneonneo line score of the row (Float64 so values match the array search bit for bit). */
  heur: Float64Array;
  maxRank: Uint8Array;
  empty: Uint8Array;
}

let tables: Tables | null = null;

/**
 * Build the row tables (about 0.2 s, once per thread). Call early — the worker
 * does on startup — so the first suggestion doesn't pay for it.
 */
export function getTables(): Tables {
  if (tables) return tables;
  const t: Tables = {
    left: new Uint16Array(ROW_COUNT),
    right: new Uint16Array(ROW_COUNT),
    heur: new Float64Array(ROW_COUNT),
    maxRank: new Uint8Array(ROW_COUNT),
    empty: new Uint8Array(ROW_COUNT),
  };
  const line = [0, 0, 0, 0];
  for (let row = 0; row < ROW_COUNT; row++) {
    for (let i = 0; i < SIZE; i++) line[i] = (row >> (4 * i)) & 0xf;
    t.heur[row] = lineScore(line[0], line[1], line[2], line[3]);
    t.maxRank[row] = Math.max(line[0], line[1], line[2], line[3]);
    t.empty[row] = line.filter((r) => r === 0).length;
    t.left[row] = packLine(slideRanks(line));
    t.right[row] = packLine(slideRanks([...line].reverse()).reverse());
  }
  tables = t;
  return t;
}

/** Slide + merge one line of ranks toward index 0 (each tile merges at most once). */
function slideRanks(line: readonly number[]): number[] {
  const tiles = line.filter((r) => r !== 0);
  const out: number[] = [];
  for (let i = 0; i < tiles.length; i++) {
    if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
      // Only 15+15 could overflow, and canUseBitboard rules that out.
      out.push(Math.min(MAX_RANK, tiles[i] + 1));
      i++;
    } else {
      out.push(tiles[i]);
    }
  }
  while (out.length < SIZE) out.push(0);
  return out;
}

function packLine(line: readonly number[]): number {
  return line[0] | (line[1] << 4) | (line[2] << 8) | (line[3] << 12);
}

/** Column j of the board, packed like a row (row 0 in the lowest nibble). Transposing twice is the identity. */
function column(j: number, r0: number, r1: number, r2: number, r3: number): number {
  const s = 4 * j;
  return ((r0 >> s) & 0xf) | (((r1 >> s) & 0xf) << 4) | (((r2 >> s) & 0xf) << 8) | (((r3 >> s) & 0xf) << 12);
}

/**
 * True when this board can be searched on packed rows: every tile fits a
 * nibble (≤ 32768) and the tile sum stays below 65536 even after the most
 * spawns (4 each) the deepest search adds, so no merge can overflow.
 */
export function canUseBitboard(board: Board): boolean {
  let sum = 0;
  for (const row of board) {
    for (const v of row) {
      if (v > 2 ** MAX_RANK) return false;
      sum += v;
    }
  }
  return sum + 4 * MAX_DEPTH < 2 ** (MAX_RANK + 1);
}

// ---- search -------------------------------------------------------------

/** Direction codes in DIRECTIONS order: up, down, left, right. */
const UP = 0;
const DOWN = 1;
const LEFT = 2;

/** Spawn ranks with their probabilities, from SPAWNS. */
const SPAWN_RANKS = SPAWNS.map(([value, prob]) => [Math.log2(value), prob] as const);

interface SearchContext {
  t: Tables;
  cache: Map<string, number>;
  nodes: number;
  /** Tiles above this rank end the game; 99 when there is no cap. */
  capRank: number;
}

/** Scratch output of `moveInto`; callers copy it out before recursing. */
const moved = new Uint16Array(SIZE);

/** Apply direction `d` to the rows; the result lands in `moved`. */
function moveInto(t: Tables, d: number, r0: number, r1: number, r2: number, r3: number): void {
  if (d === LEFT || d === LEFT + 1) {
    const table = d === LEFT ? t.left : t.right;
    moved[0] = table[r0];
    moved[1] = table[r1];
    moved[2] = table[r2];
    moved[3] = table[r3];
    return;
  }
  // Up/down slide the columns toward row 0 / row 3, then transpose back.
  const table = d === UP ? t.left : t.right;
  const c0 = table[column(0, r0, r1, r2, r3)];
  const c1 = table[column(1, r0, r1, r2, r3)];
  const c2 = table[column(2, r0, r1, r2, r3)];
  const c3 = table[column(3, r0, r1, r2, r3)];
  moved[0] = column(0, c0, c1, c2, c3);
  moved[1] = column(1, c0, c1, c2, c3);
  moved[2] = column(2, c0, c1, c2, c3);
  moved[3] = column(3, c0, c1, c2, c3);
}

function maxRankOf(t: Tables, r0: number, r1: number, r2: number, r3: number): number {
  return Math.max(t.maxRank[r0], t.maxRank[r1], t.maxRank[r2], t.maxRank[r3]);
}

/** Sum of line scores over rows then columns — the same order as heuristicScore. */
function heuristic(t: Tables, r0: number, r1: number, r2: number, r3: number): number {
  let score = 0;
  score += t.heur[r0];
  score += t.heur[r1];
  score += t.heur[r2];
  score += t.heur[r3];
  score += t.heur[column(0, r0, r1, r2, r3)];
  score += t.heur[column(1, r0, r1, r2, r3)];
  score += t.heur[column(2, r0, r1, r2, r3)];
  score += t.heur[column(3, r0, r1, r2, r3)];
  return score;
}

/** Chance node: average the value over every possible random spawn. */
function chanceValue(
  r0: number,
  r1: number,
  r2: number,
  r3: number,
  cumProb: number,
  depth: number,
  ctx: SearchContext,
): number {
  const { t } = ctx;
  if (maxRankOf(t, r0, r1, r2, r3) > ctx.capRank) return ENDING_TILE_PENALTY;
  if (depth <= 0 || cumProb < PROB_THRESHOLD || ctx.nodes >= NODE_BUDGET) {
    return heuristic(t, r0, r1, r2, r3);
  }
  const n = t.empty[r0] + t.empty[r1] + t.empty[r2] + t.empty[r3];
  if (n === 0) return heuristic(t, r0, r1, r2, r3);

  const key = String.fromCharCode(r0, r1, r2, r3, depth);
  const cached = ctx.cache.get(key);
  if (cached !== undefined) return cached;
  ctx.nodes++;

  // Empty cells in row-major order, each with a 2 then a 4 — as the array search.
  let value = 0;
  for (let i = 0; i < SIZE; i++) {
    const row = i === 0 ? r0 : i === 1 ? r1 : i === 2 ? r2 : r3;
    for (let j = 0; j < SIZE; j++) {
      if (((row >> (4 * j)) & 0xf) !== 0) continue;
      for (const [rank, prob] of SPAWN_RANKS) {
        const weight = prob / n;
        const next = row | (rank << (4 * j));
        value +=
          weight *
          maxValue(
            i === 0 ? next : r0,
            i === 1 ? next : r1,
            i === 2 ? next : r2,
            i === 3 ? next : r3,
            cumProb * weight,
            depth,
            ctx,
          );
      }
    }
  }

  ctx.cache.set(key, value);
  return value;
}

/** Max node: the player takes the best available swipe (deterministic). */
function maxValue(
  r0: number,
  r1: number,
  r2: number,
  r3: number,
  cumProb: number,
  depth: number,
  ctx: SearchContext,
): number {
  let best = -Infinity;
  for (let d = 0; d < DIRECTIONS.length; d++) {
    moveInto(ctx.t, d, r0, r1, r2, r3);
    const n0 = moved[0];
    const n1 = moved[1];
    const n2 = moved[2];
    const n3 = moved[3];
    if (n0 === r0 && n1 === r1 && n2 === r2 && n3 === r3) continue;
    const value = chanceValue(n0, n1, n2, n3, cumProb, depth - 1, ctx);
    if (value > best) best = value;
  }
  return best === -Infinity ? GAME_OVER_SCORE : best;
}

/**
 * Best swipe for a board admitted by `canUseBitboard`, or null when no move is
 * legal. Same contract and results as the array search's bestMove.
 */
export function bitboardBestMove(board: Board, maxTile: number): BitboardSuggestion | null {
  const t = getTables();
  const rank = (v: number) => (v === 0 ? 0 : Math.log2(v));
  const [r0, r1, r2, r3] = board.map((row) => packLine(row.map(rank)));
  // Tiles are powers of two, so "value > maxTile" is "rank > floor(log2(maxTile))".
  const capRank = maxTile === Infinity ? 99 : Math.floor(Math.log2(maxTile));
  const ctx: SearchContext = { t, cache: new Map(), nodes: 0, capRank };
  const depth = adaptiveDepth(board);

  let bestDirection: Direction | null = null;
  let bestScore = -Infinity;
  // With a cap set, prefer the best move that stays within it; only fall back
  // to a cap-breaking move when every legal move breaks it (truly forced).
  let bestSafeDirection: Direction | null = null;
  let bestSafeScore = -Infinity;

  for (let d = 0; d < DIRECTIONS.length; d++) {
    moveInto(t, d, r0, r1, r2, r3);
    const n0 = moved[0];
    const n1 = moved[1];
    const n2 = moved[2];
    const n3 = moved[3];
    if (n0 === r0 && n1 === r1 && n2 === r2 && n3 === r3) continue;
    // The first legal move is the fallback even if it scores -Infinity.
    bestDirection ??= DIRECTIONS[d];
    const score = chanceValue(n0, n1, n2, n3, 1, depth, ctx);
    if (score > bestScore) {
      bestScore = score;
      bestDirection = DIRECTIONS[d];
    }
    if (maxRankOf(t, n0, n1, n2, n3) <= capRank && score > bestSafeScore) {
      bestSafeScore = score;
      bestSafeDirection = DIRECTIONS[d];
    }
  }

  if (bestDirection === null) return null;
  if (maxTile !== Infinity && bestSafeDirection !== null) {
    return { direction: bestSafeDirection, score: bestSafeScore };
  }
  return { direction: bestDirection, score: bestScore };
}
