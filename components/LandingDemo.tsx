'use client';

import { useEffect, useState } from 'react';
import { Board } from '@/components/Board';
import type { Board as BoardType, Direction } from '@/lib/game/board';

interface DemoFrame {
  board: BoardType;
  /** The move the solver would suggest for this position (shown on the badge). */
  direction: Direction;
}

const GLYPH: Record<Direction, string> = { up: '↑', down: '↓', left: '←', right: '→' };

/**
 * A short scripted opening (moves + spawns follow real 2048 rules), hard-coded
 * as data so the demo can never throw. Each frame shows a position and the
 * swipe the solver picks; the loop restarts after the last frame.
 */
const FRAMES: DemoFrame[] = [
  { board: [[2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 0, 0]], direction: 'up' },
  { board: [[4, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 2, 0]], direction: 'left' },
  { board: [[4, 0, 0, 0], [0, 0, 0, 2], [0, 0, 0, 0], [2, 0, 0, 0]], direction: 'up' },
  { board: [[4, 0, 0, 2], [2, 0, 0, 0], [0, 4, 0, 0], [0, 0, 0, 0]], direction: 'left' },
  { board: [[4, 2, 0, 0], [2, 0, 0, 0], [4, 0, 0, 0], [0, 2, 0, 0]], direction: 'up' },
  { board: [[4, 4, 0, 0], [2, 0, 0, 0], [4, 0, 0, 0], [0, 0, 0, 2]], direction: 'left' },
  { board: [[8, 0, 0, 0], [2, 0, 0, 0], [4, 0, 4, 0], [2, 0, 0, 0]], direction: 'left' },
  { board: [[8, 0, 0, 0], [2, 2, 0, 0], [8, 0, 0, 0], [2, 0, 0, 0]], direction: 'up' },
];

const FRAME_MS = 1600;

/** Decorative auto-playing board for the landing hero. */
export function LandingDemo() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), FRAME_MS);
    return () => clearInterval(timer);
  }, []);

  const { board, direction } = FRAMES[frame];

  return (
    <div className="demo" aria-hidden="true">
      <span className="demo__badge">
        <span className="demo__glyph">{GLYPH[direction]}</span> swipe {direction}
      </span>
      {/* key remounts the board each frame so the tick animation replays */}
      <div className="demo__board" key={frame}>
        <Board board={board} variant="small" />
      </div>
    </div>
  );
}
