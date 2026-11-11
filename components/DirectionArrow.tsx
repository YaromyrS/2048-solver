import { useMessages } from '@/components/I18nProvider';
import type { Direction } from '@/lib/game/board';

const GLYPH: Record<Direction, string> = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

/** Visual only: the instruction above already says which way to swipe. */
export function DirectionArrow({ direction }: { direction: Direction }) {
  const t = useMessages();
  return (
    <div className="direction" aria-hidden="true">
      <span className="direction__glyph">{GLYPH[direction]}</span>
      <span className="direction__label">{t.directionLabels[direction]}</span>
    </div>
  );
}
