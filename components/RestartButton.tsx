import { useMessages } from '@/components/I18nProvider';
import { RestartIcon } from '@/components/icons';

export function RestartButton({ onClick }: { onClick: () => void }) {
  const t = useMessages();
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onClick}
      aria-label={t.topbar.restart}
      title={t.topbar.restart}
    >
      <RestartIcon />
    </button>
  );
}
