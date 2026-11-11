import type { MetadataRoute } from 'next';
import { LOCALES, languageAlternates, localeUrl } from '@/lib/i18n/locales';

// A single-page app: the start screen is the only URL worth indexing, once per
// language. Each entry lists the other languages too, matching the pages'
// own hreflang links.
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = languageAlternates();
  return LOCALES.map((l) => ({
    url: localeUrl(l.code),
    changeFrequency: 'monthly',
    priority: 1,
    alternates: { languages },
  }));
}
