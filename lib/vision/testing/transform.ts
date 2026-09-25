import type { RGBAImage } from '@/lib/vision/image';

/** Bilinear resize by `factor`, standing in for screenshots taken at another pixel density. */
export function resize(img: RGBAImage, factor: number): RGBAImage {
  const width = Math.round(img.width * factor);
  const height = Math.round(img.height * factor);
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    const sy = Math.min(img.height - 1, (y + 0.5) / factor - 0.5);
    const y0 = Math.max(0, Math.floor(sy));
    const y1 = Math.min(img.height - 1, y0 + 1);
    const fy = Math.max(0, sy - y0);
    for (let x = 0; x < width; x++) {
      const sx = Math.min(img.width - 1, (x + 0.5) / factor - 0.5);
      const x0 = Math.max(0, Math.floor(sx));
      const x1 = Math.min(img.width - 1, x0 + 1);
      const fx = Math.max(0, sx - x0);
      for (let c = 0; c < 4; c++) {
        const at = (px: number, py: number) => img.data[(py * img.width + px) * 4 + c];
        const top = at(x0, y0) * (1 - fx) + at(x1, y0) * fx;
        const bottom = at(x0, y1) * (1 - fx) + at(x1, y1) * fx;
        data[(y * width + x) * 4 + c] = top * (1 - fy) + bottom * fy;
      }
    }
  }
  return { width, height, data };
}

/** Add deterministic noise of up to ±`amplitude` per channel, standing in for JPEG artefacts. */
export function addNoise(img: RGBAImage, amplitude: number, seed = 1): RGBAImage {
  let state = seed >>> 0;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const data = new Uint8ClampedArray(img.data);
  for (let i = 0; i < data.length; i++) {
    if (i % 4 !== 3) data[i] = data[i] + Math.round((next() * 2 - 1) * amplitude);
  }
  return { width: img.width, height: img.height, data };
}
