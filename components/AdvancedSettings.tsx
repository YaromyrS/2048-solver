import { useId } from 'react';

/** Cap choices offered in the picker (largest tile the solver may form). */
const MAX_TILE_CHOICES = [512, 1024, 2048, 4096, 8192];

interface AdvancedSettingsProps {
  /** Largest tile the solver may form; `null` means no limit. */
  maxTile: number | null;
  onMaxTileChange: (value: number | null) => void;
}

/**
 * Collapsible "Advanced settings" panel.
 *
 * Holds the solver's tile cap — the maximum number to reach before the game
 * ends. The solver plays up to the cap and only forms the next tile (which
 * ends the game) when every legal move does.
 */
export function AdvancedSettings({ maxTile, onMaxTileChange }: AdvancedSettingsProps) {
  const selectId = useId();
  return (
    <details className="advanced">
      <summary className="advanced__summary">Advanced settings</summary>
      <div className="advanced__body">
        <label className="advanced__label" htmlFor={selectId}>
          Maximum number before game end
        </label>
        <select
          id={selectId}
          className="advanced__select"
          value={maxTile === null ? 'none' : String(maxTile)}
          onChange={(e) =>
            onMaxTileChange(e.target.value === 'none' ? null : Number(e.target.value))
          }
        >
          {MAX_TILE_CHOICES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
          <option value="none">No limit</option>
        </select>
        <p className="advanced__hint">
          {maxTile === null
            ? 'No cap — the solver plays all-out for the highest tile.'
            : `The solver plays up to ${maxTile} and only forms ${maxTile * 2} — which ends the game — when no other move exists.`}
        </p>
      </div>
    </details>
  );
}
