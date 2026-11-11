import { Rubik } from 'next/font/google';

// All font subsets are self-hosted and picked by unicode-range; only Latin is
// preloaded. Rubik has no Vietnamese or CJK glyphs, so those pages fall back
// to system fonts (see globals.css).
export const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rubik',
});
