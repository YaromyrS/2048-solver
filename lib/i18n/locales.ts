import { SITE_URL } from '@/lib/site';

export interface LocaleInfo {
  /** Route segment, e.g. "ja" for /ja. English is served at "/" instead of "/en". */
  code: string;
  /** BCP 47 tag for <html lang> and for hreflang on links. */
  htmlLang: string;
  /** hreflang values that send searchers to this version. */
  hreflang: readonly string[];
  /** Open Graph locale, e.g. "ja_JP". */
  ogLocale: string;
  /** The language's own name, as shown in the language switcher. */
  name: string;
}

/**
 * Every language the site is published in, in switcher order. Adding one takes
 * an entry here and a messages file in lib/i18n/messages/.
 *
 * Chinese is Traditional only, aimed at Taiwan and Hong Kong: *.vercel.app is
 * blocked in mainland China. Portuguese is Brazilian, but it is offered to
 * every Portuguese searcher.
 */
export const LOCALES = [
  { code: 'en', htmlLang: 'en', hreflang: ['en'], ogLocale: 'en_US', name: 'English' },
  { code: 'es', htmlLang: 'es', hreflang: ['es'], ogLocale: 'es_ES', name: 'Español' },
  { code: 'fr', htmlLang: 'fr', hreflang: ['fr'], ogLocale: 'fr_FR', name: 'Français' },
  { code: 'de', htmlLang: 'de', hreflang: ['de'], ogLocale: 'de_DE', name: 'Deutsch' },
  { code: 'it', htmlLang: 'it', hreflang: ['it'], ogLocale: 'it_IT', name: 'Italiano' },
  { code: 'pt', htmlLang: 'pt-BR', hreflang: ['pt'], ogLocale: 'pt_BR', name: 'Português' },
  { code: 'tr', htmlLang: 'tr', hreflang: ['tr'], ogLocale: 'tr_TR', name: 'Türkçe' },
  { code: 'id', htmlLang: 'id', hreflang: ['id'], ogLocale: 'id_ID', name: 'Bahasa Indonesia' },
  { code: 'vi', htmlLang: 'vi', hreflang: ['vi'], ogLocale: 'vi_VN', name: 'Tiếng Việt' },
  { code: 'uk', htmlLang: 'uk', hreflang: ['uk'], ogLocale: 'uk_UA', name: 'Українська' },
  { code: 'ja', htmlLang: 'ja', hreflang: ['ja'], ogLocale: 'ja_JP', name: '日本語' },
  { code: 'ko', htmlLang: 'ko', hreflang: ['ko'], ogLocale: 'ko_KR', name: '한국어' },
  {
    code: 'zh-hant',
    htmlLang: 'zh-Hant',
    hreflang: ['zh-TW', 'zh-HK'],
    ogLocale: 'zh_TW',
    name: '繁體中文',
  },
] as const satisfies readonly LocaleInfo[];

export type Locale = (typeof LOCALES)[number]['code'];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return LOCALES.some((l) => l.code === value);
}

export function localeInfo(locale: Locale): LocaleInfo {
  const info = LOCALES.find((l) => l.code === locale);
  if (!info) throw new Error(`Unknown locale "${locale}"`);
  return info;
}

/**
 * Site-relative path of a language's page. English keeps "/" so the URL that
 * search engines already know stays the canonical English page.
 */
export function localePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : `/${locale}`;
}

/** Absolute URL of a language's page, matching its canonical link. */
export function localeUrl(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? SITE_URL : `${SITE_URL}/${locale}`;
}

/**
 * hreflang → URL for every version, plus x-default (English) for searchers
 * whose language isn't offered. Every page lists all of them, itself included.
 */
export function languageAlternates(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of LOCALES) {
    for (const tag of l.hreflang) map[tag] = localeUrl(l.code);
  }
  map['x-default'] = localeUrl(DEFAULT_LOCALE);
  return map;
}
