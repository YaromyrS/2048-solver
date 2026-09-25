import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import type { RGBAImage } from '@/lib/vision/image';

/**
 * Minimal PNG decoder for test fixtures (Node only), so the vision tests can
 * read real screenshots without an image library. Supports what screenshot
 * tools write: 8-bit, non-interlaced, RGB or RGBA. Anything else throws.
 */
export function decodePng(path: string): RGBAImage {
  const buf = readFileSync(path);
  const signature = '89504e470d0a1a0a';
  if (buf.subarray(0, 8).toString('hex') !== signature) throw new Error(`${path}: not a PNG`);

  let width = 0;
  let height = 0;
  let channels = 0;
  const idat: Buffer[] = [];
  for (let off = 8; off < buf.length; ) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const body = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      const bitDepth = body[8];
      const colorType = body[9];
      const interlace = body[12];
      if (bitDepth !== 8 || interlace !== 0 || (colorType !== 2 && colorType !== 6)) {
        throw new Error(`${path}: unsupported PNG (depth ${bitDepth}, type ${colorType}, interlace ${interlace})`);
      }
      channels = colorType === 6 ? 4 : 3;
    } else if (type === 'IDAT') {
      idat.push(body);
    } else if (type === 'IEND') {
      break;
    }
    off += 12 + len;
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const pixels = new Uint8Array(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const row = pixels.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null;
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? row[i - channels] : 0;
      const b = prev ? prev[i] : 0;
      const c = prev && i >= channels ? prev[i - channels] : 0;
      let v = src[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      } else if (filter !== 0) {
        throw new Error(`${path}: bad filter ${filter} on row ${y}`);
      }
      row[i] = v & 0xff;
    }
  }

  const data = new Uint8ClampedArray(width * height * 4);
  for (let p = 0; p < width * height; p++) {
    data[p * 4] = pixels[p * channels];
    data[p * 4 + 1] = pixels[p * channels + 1];
    data[p * 4 + 2] = pixels[p * channels + 2];
    data[p * 4 + 3] = channels === 4 ? pixels[p * channels + 3] : 255;
  }
  return { width, height, data };
}
