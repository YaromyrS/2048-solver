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

export function DirectionArrow({ direction }: { direction: Direction }) {
  return (
    <div className="direction" aria-label={`Swipe ${LABEL[direction]}`}>
      <span className="direction__glyph" aria-hidden="true">
        {GLYPH[direction]}
      </span>
      <span className="direction__label">{LABEL[direction]}</span>
    </div>
  );
}
