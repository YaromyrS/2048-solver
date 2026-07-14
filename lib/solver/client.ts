/**
 * Async entry point the UI uses to request a move suggestion.
 *
 * Runs the expectimax search in a dedicated Web Worker so the main thread (and
 * the "Calculating…" indicator) never freezes. Falls back to a synchronous
 * main-thread search where workers don't exist (SSR, tests) or if the worker
 * itself fails to load.
 */

import type { Board } from '@/lib/game/board';
import { bestMove, type MoveSuggestion, type SolveOptions } from './expectimax';
import type { SolveRequest, SolveResponse } from './solver.worker';

interface PendingRequest {
  resolve: (result: MoveSuggestion | null) => void;
  board: Board;
  options: SolveOptions;
}

let worker: Worker | null = null;
let workerBroken = false;
let nextId = 0;
const pending = new Map<number, PendingRequest>();

function getWorker(): Worker | null {
  if (workerBroken || typeof Worker === 'undefined') return null;
  if (worker === null) {
    worker = new Worker(new URL('./solver.worker.ts', import.meta.url));
    worker.onmessage = (e: MessageEvent<SolveResponse>) => {
      const request = pending.get(e.data.id);
      if (request) {
        pending.delete(e.data.id);
        request.resolve(e.data.result);
      }
    };
    // If the worker script fails (load or runtime), answer every in-flight
    // request on the main thread and stop using workers — a slower suggestion
    // beats a UI stuck on "Calculating…" forever.
    worker.onerror = (event) => {
      console.error('Solver worker failed; falling back to main-thread search.', event);
      workerBroken = true;
      worker?.terminate();
      worker = null;
      const requests = [...pending.values()];
      pending.clear();
      for (const request of requests) {
        request.resolve(bestMove(request.board, request.options));
      }
    };
  }
  return worker;
}

/** Suggest the best swipe for `board`, or `null` when the position is terminal. */
export function computeBestMove(
  board: Board,
  options: SolveOptions = {},
): Promise<MoveSuggestion | null> {
  const w = getWorker();
  if (w === null) return Promise.resolve(bestMove(board, options));
  const id = nextId++;
  return new Promise((resolve) => {
    pending.set(id, { resolve, board, options });
    const request: SolveRequest = { id, board, options };
    w.postMessage(request);
  });
}
