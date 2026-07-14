export type NewTileValue = 2 | 4;

interface NumberSelectorProps {
  value: NewTileValue;
  onChange: (value: NewTileValue) => void;
}

const OPTIONS: NewTileValue[] = [2, 4];

export function NumberSelector({ value, onChange }: NumberSelectorProps) {
  return (
    <div className="number-selector" role="radiogroup" aria-label="Value of the new tile">
      {OPTIONS.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          className={
            `selector-tile tile tile-${n}` + (value === n ? ' selector-tile--active' : '')
          }
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
