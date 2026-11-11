import { useMessages } from '@/components/I18nProvider';
import { UndoIcon } from '@/components/icons';

export function UndoButton({ onClick }: { onClick: () => void }) {
  const t = useMessages();
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onClick}
      aria-label={t.topbar.undo}
      title={t.topbar.undo}
    >
      <UndoIcon />
    </button>
  );
}
