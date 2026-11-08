import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Rubik } from 'next/font/google';
import type { ReactNode } from 'react';
import { DESCRIPTION, SITE_NAME, SITE_URL, TAGLINE } from '@/lib/site';
import './globals.css';

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} – Best Next Move, One Tap per Move`,
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: 'FlexDev' }],
  // Preview deployments and the old domain all point search engines here.
  alternates: { canonical: '/' },
  openGraph: {
    title: SITE_NAME,
    description: TAGLINE,
    url: '/',
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: TAGLINE,
  },
};

// schema.org data for search engines. WebSite.name is what Google shows as the
// site name in results (instead of "vercel.app"); WebApplication says it's a
// free, in-browser game tool.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    {
      '@type': 'WebApplication',
      name: SITE_NAME,
      url: SITE_URL,
      description: DESCRIPTION,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8ef' },
    { media: '(prefers-color-scheme: dark)', color: '#181614' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={rubik.variable}>
      <body>
        <script
          type="application/ld+json"
          // Escaping "<" keeps the JSON from closing the script tag early.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
