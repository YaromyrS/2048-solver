export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onClick}
      aria-label="Back to menu"
      title="Back to menu"
    >
      ⌂
    </button>
  );
}
