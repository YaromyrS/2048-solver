import { useMessages } from '@/components/I18nProvider';
import { HomeIcon } from '@/components/icons';

export function MenuButton({ onClick }: { onClick: () => void }) {
  const t = useMessages();
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onClick}
      aria-label={t.topbar.menu}
      title={t.topbar.menu}
    >
      <HomeIcon />
    </button>
  );
}
