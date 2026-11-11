import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';
import { rubik } from './fonts';
import './globals.css';

// The root layout lives in app/[lang]/, so a URL outside every language (say
// /xyz) has no layout to render a 404 in. This page stands in for it, in
// English, with the site's styles. Next adds noindex to it.
export const metadata: Metadata = {
  title: `Page not found – ${SITE_NAME}`,
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={rubik.variable}>
      <body>
        <main className="app">
          <div className="stage">
            <h1>Page not found</h1>
            <p>There’s nothing at this address.</p>
            <a className="btn btn--primary" href="/">
              Go to {SITE_NAME}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
