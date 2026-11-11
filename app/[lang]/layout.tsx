import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { I18nProvider } from '@/components/I18nProvider';
import {
  LOCALES,
  isLocale,
  languageAlternates,
  localeInfo,
  localePath,
  localeUrl,
  type Locale,
} from '@/lib/i18n/locales';
import { getMessages } from '@/lib/i18n/messages';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { rubik } from '../fonts';
import '../globals.css';

type LangParams = { params: Promise<{ lang: string }> };

/** Each language is a static page; any other first path segment is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((l) => ({ lang: l.code }));
}

async function resolveLocale(params: LangParams['params']): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getMessages(locale);
  const info = localeInfo(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: t.meta.title,
    description: t.meta.description,
    applicationName: SITE_NAME,
    authors: [{ name: 'FlexDev' }],
    // Every version names itself canonical and lists all the others, so search
    // engines show each searcher their own language. The old domain and preview
    // deployments point here too.
    alternates: { canonical: localePath(locale), languages: languageAlternates() },
    openGraph: {
      title: SITE_NAME,
      description: t.tagline,
      url: localePath(locale),
      siteName: SITE_NAME,
      type: 'website',
      locale: info.ogLocale,
      alternateLocale: LOCALES.filter((l) => l.code !== locale).map((l) => l.ogLocale),
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: t.tagline,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8ef' },
    { media: '(prefers-color-scheme: dark)', color: '#181614' },
  ],
};

export default async function RootLayout({ children, params }: LangParams & { children: ReactNode }) {
  const locale = await resolveLocale(params);
  const t = getMessages(locale);
  const { htmlLang } = localeInfo(locale);

  // schema.org data for search engines. WebSite.name is what Google shows as the
  // site name in results (instead of "vercel.app"); WebApplication says it's a
  // free, in-browser game tool, described in this page's language.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
      {
        '@type': 'WebApplication',
        name: SITE_NAME,
        url: localeUrl(locale),
        description: t.meta.description,
        inLanguage: htmlLang,
        applicationCategory: 'GameApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    ],
  };

  return (
    <html lang={htmlLang} className={rubik.variable}>
      <body>
        <script
          type="application/ld+json"
          // Escaping "<" keeps the JSON from closing the script tag early.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <I18nProvider messages={t}>{children}</I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
