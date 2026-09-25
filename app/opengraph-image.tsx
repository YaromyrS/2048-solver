import { ImageResponse } from 'next/og';
import { SITE_NAME, TAGLINE } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${SITE_NAME} — ${TAGLINE}`;

const TILE_COLORS: Record<number, { bg: string; fg: string }> = {
  2: { bg: '#eee4da', fg: '#776e65' },
  4: { bg: '#ede0c8', fg: '#776e65' },
  8: { bg: '#f2b179', fg: '#f9f6f2' },
  16: { bg: '#f59563', fg: '#f9f6f2' },
  32: { bg: '#f67c5f', fg: '#f9f6f2' },
  64: { bg: '#f65e3b', fg: '#f9f6f2' },
  128: { bg: '#edcf72', fg: '#f9f6f2' },
  256: { bg: '#edcc61', fg: '#f9f6f2' },
  512: { bg: '#edc850', fg: '#f9f6f2' },
  1024: { bg: '#edc53f', fg: '#f9f6f2' },
};

/** A tidy "snake"-ordered board — the shape the solver plays toward. */
const DEMO_BOARD = [
  [1024, 512, 256, 128],
  [16, 32, 64, 128],
  [8, 4, 2, 0],
  [2, 0, 0, 0],
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 80,
          background: '#faf8ef',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: 14,
            background: '#bbada0',
            borderRadius: 16,
          }}
        >
          {DEMO_BOARD.map((row, r) => (
            <div key={r} style={{ display: 'flex', gap: 12 }}>
              {row.map((value, c) => {
                const color = TILE_COLORS[value];
                return (
                  <div
                    key={c}
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: value >= 1000 ? 30 : value >= 100 ? 36 : 44,
                      fontWeight: 700,
                      background: color ? color.bg : 'rgba(238, 228, 218, 0.35)',
                      color: color ? color.fg : 'transparent',
                    }}
                  >
                    {value !== 0 ? value : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 520 }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: '#776e65', letterSpacing: '-3px' }}>
            {SITE_NAME}
          </div>
          <div style={{ fontSize: 34, color: '#8f857d', marginTop: 18, lineHeight: 1.35 }}>
            {TAGLINE}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 34,
              fontSize: 24,
              fontWeight: 700,
              color: '#f9f6f2',
              background: '#8f7a66',
              borderRadius: 999,
              padding: '10px 26px',
              alignSelf: 'flex-start',
            }}
          >
            expectimax AI · runs in your browser
          </div>
        </div>
      </div>
    ),
    size,
  );
}
