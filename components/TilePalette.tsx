/** Values a user can paint onto the board in the Continue editor. */
export const PALETTE_VALUES = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048] as const;

/** A palette selection: any face value, or 0 meaning "erase". */
export type PaletteValue = (typeof PALETTE_VALUES)[number] | 0;

interface TilePaletteProps {
  value: PaletteValue;
  onChange: (value: PaletteValue) => void;
}

export function TilePalette({ value, onChange }: TilePaletteProps) {
  return (
    <div className="tile-palette" role="radiogroup" aria-label="Tile value to place">
      <button
        type="button"
        role="radio"
        aria-checked={value === 0}
        className={'palette-tile palette-erase' + (value === 0 ? ' palette-tile--active' : '')}
        onClick={() => onChange(0)}
      >
        Erase
      </button>
      {PALETTE_VALUES.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          className={`palette-tile tile tile-${n}` + (value === n ? ' palette-tile--active' : '')}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
