export function UndoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onClick}
      aria-label="Undo last move"
      title="Undo last move"
    >
      ↶
    </button>
  );
}
