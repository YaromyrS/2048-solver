/**
 * Dedicated worker that runs the expectimax search off the main thread, so the
 * UI stays responsive while "Calculating…". Protocol: receives a SolveRequest,
 * answers with a SolveResponse carrying the same id (see client.ts).
 */

import type { Board } from '@/lib/game/board';
import { bestMove, type MoveSuggestion, type SolveOptions } from './expectimax';

export interface SolveRequest {
  id: number;
  board: Board;
  options: SolveOptions;
}

export interface SolveResponse {
  id: number;
  result: MoveSuggestion | null;
}

// TS types this file against the DOM lib, where postMessage means
// window.postMessage(message, targetOrigin) — narrow to the worker-scope shape.
const workerScope = globalThis as unknown as {
  postMessage(message: SolveResponse): void;
  onmessage: ((e: MessageEvent<SolveRequest>) => void) | null;
};

workerScope.onmessage = (e: MessageEvent<SolveRequest>) => {
  const { id, board, options } = e.data;
  workerScope.postMessage({ id, result: bestMove(board, options) });
};
