interface AvoidToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

/**
 * Switch for the "avoid making 2048" strategy. When on, the solver caps play at
 * 1024 and only forms 2048 when no other move is legal (this game ends at 2048).
 */
export function AvoidToggle({ checked, onChange }: AvoidToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`toggle${checked ? ' toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
      title="This game ends the moment a 2048 tile appears. When on, the solver plays to 1024 and only forms 2048 if forced."
    >
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
      <span className="toggle__label">Avoid making 2048</span>
    </button>
  );
}
