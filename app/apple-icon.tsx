import { tileIconResponse } from './tile-icon';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon for iOS — full-bleed square, iOS applies its own mask. */
export default function AppleIcon() {
  return tileIconResponse(size.width);
}
