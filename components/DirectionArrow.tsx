import type { Direction } from '@/lib/game/board';

const GLYPH: Record<Direction, string> = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

const LABEL: Record<Direction, string> = {
  up: 'Up',
  down: 'Down',
  left: 'Left',
  right: 'Right',
};

/** Visual only: the instruction above already says which way to swipe. */
export function DirectionArrow({ direction }: { direction: Direction }) {
  return (
    <div className="direction" aria-hidden="true">
      <span className="direction__glyph">{GLYPH[direction]}</span>
      <span className="direction__label">{LABEL[direction]}</span>
    </div>
  );
}
