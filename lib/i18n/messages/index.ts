import type { Locale } from '@/lib/i18n/locales';
import de from './de';
import en, { type Messages } from './en';
import es from './es';
import fr from './fr';
import id from './id';
import it from './it';
import ja from './ja';
import ko from './ko';
import pt from './pt';
import tr from './tr';
import uk from './uk';
import vi from './vi';
import zhHant from './zh-hant';

export type { Messages };

/**
 * All dictionaries. Import this only from server code (layouts, pages, metadata
 * routes): a page hands its one dictionary to the client through
 * I18nProvider, so the other languages never reach the browser.
 */
export const MESSAGES: Record<Locale, Messages> = {
  en,
  es,
  fr,
  de,
  it,
  pt,
  tr,
  id,
  vi,
  uk,
  ja,
  ko,
  'zh-hant': zhHant,
};

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale];
}
