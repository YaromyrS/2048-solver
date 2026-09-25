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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
