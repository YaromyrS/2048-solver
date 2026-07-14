import { ImageResponse } from 'next/og';

/**
 * Shared renderer for every raster app icon (apple-touch + PWA manifest).
 * Full-bleed gold square, no rounded corners: launchers and iOS apply their
 * own masks, and a full-bleed background keeps the icon maskable-safe.
 */
export function tileIconResponse(size: number): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#edc22e',
          color: '#f9f6f2',
          fontSize: Math.round(size * 0.31),
          fontWeight: 700,
          letterSpacing: `-${Math.max(1, Math.round(size * 0.012))}px`,
        }}
      >
        2048
      </div>
    ),
    { width: size, height: size },
  );
}
