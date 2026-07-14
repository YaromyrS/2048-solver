import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '2048 Solver',
    short_name: '2048 Solver',
    description:
      'Tell it your board and it works out the best swipe — move after move. Runs entirely in your browser.',
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
