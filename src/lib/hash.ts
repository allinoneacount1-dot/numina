/**
 * Shared deterministic hash utilities.
 * Used by SigilAvatar and sigil.ts generator.
 */

export function hashSeed(seed: string): number[] {
  let h = 0;
  const bytes: number[] = [];
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
    bytes.push(h & 0xff);
  }
  for (let i = bytes.length; i < 32; i++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    bytes.push((h >> 16) & 0xff);
  }
  return bytes;
}

export function pick(bytes: number[], index: number, max: number): number {
  return bytes[index % bytes.length] % max;
}

/** Sanitize seed to prevent SVG injection — only allow alphanumeric, dash, underscore */
export function sanitizeSeed(seed: string): string {
  return seed.replace(/[^a-zA-Z0-9\-_]/g, "").slice(0, 64);
}
