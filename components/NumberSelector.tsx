import { useMessages } from '@/components/I18nProvider';
import { format } from '@/lib/i18n/format';

export type NewTileValue = 2 | 4;

interface NumberSelectorProps {
  value: NewTileValue;
  onChange: (value: NewTileValue) => void;
}

const OPTIONS: NewTileValue[] = [2, 4];

export function NumberSelector({ value, onChange }: NumberSelectorProps) {
  const t = useMessages();
  return (
    <div className="number-selector" role="radiogroup" aria-label={t.proposal.selectorLabel}>
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
          title={format(t.proposal.selectorTitle, { value: n })}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
