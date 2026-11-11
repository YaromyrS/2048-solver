import { GlobeIcon } from '@/components/icons';
import { LOCALES, localeInfo, localePath, type Locale } from '@/lib/i18n/locales';

interface LanguageSwitcherProps {
  current: Locale;
  /** "Language" in the current language, for screen readers. */
  label: string;
}

/**
 * Footer list of every language version. Plain links, so search engines find
 * each version from every other one, and it works without JavaScript. The
 * links are in the page even while the list is closed.
 */
export function LanguageSwitcher({ current, label }: LanguageSwitcherProps) {
  return (
    <details className="lang-switch">
      <summary className="lang-switch__summary" title={label}>
        <GlobeIcon />
        <span className="sr-only">{label}: </span>
        {localeInfo(current).name}
      </summary>
      <ul className="lang-switch__list">
        {LOCALES.map((l) => (
          <li key={l.code}>
            <a
              href={localePath(l.code)}
              hrefLang={l.htmlLang}
              lang={l.htmlLang}
              aria-current={l.code === current ? 'page' : undefined}
            >
              {l.name}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
