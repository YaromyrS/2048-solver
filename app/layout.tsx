import type { Metadata, Viewport } from 'next';
import { Rubik } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rubik',
});

// On Vercel this resolves to the production deployment URL so Open Graph /
// Twitter images get absolute URLs; locally it falls back to localhost.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '2048 Solver',
  description:
    'Tell it your board and it works out the best swipe — move after move. An expectimax-powered move advisor for your real 2048 game, running entirely in your browser.',
  applicationName: '2048 Solver',
  authors: [{ name: 'FlexDev' }],
  openGraph: {
    title: '2048 Solver',
    description: 'Tell it your board and it works out the best swipe — move after move.',
    url: '/',
    siteName: '2048 Solver',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '2048 Solver',
    description: 'Tell it your board and it works out the best swipe — move after move.',
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
      <body>{children}</body>
    </html>
  );
}
