export function RestartButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onClick}
      aria-label="Restart game"
      title="Restart game"
    >
      ↻
    </button>
  );
}
