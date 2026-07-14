import { tileIconResponse } from '../tile-icon';

export const dynamic = 'force-static';

export function GET() {
  return tileIconResponse(512);
}
