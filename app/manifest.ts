import type { MetadataRoute } from 'next';
import en from '@/lib/i18n/messages/en';
import { SITE_NAME } from '@/lib/site';

// One manifest for every language; the installed app opens the English page.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: '2048 Solver',
    description: en.meta.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8ef',
    theme_color: '#faf8ef',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
