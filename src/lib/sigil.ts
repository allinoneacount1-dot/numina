/**
 * Deterministic Sigil SVG generator.
 * Produces a unique sacred-geometry SVG from a seed string.
 */

import { hashSeed, pick } from "./hash";

export function generateSigilSVG(seed: string, size = 200): string {
  const b = hashSeed(seed);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;

  const palettes = [
    ["#C9A84C", "#2E8B8B", "#1a1a2e"],
    ["#D4AF37", "#5B8C8A", "#16213e"],
    ["#B8860B", "#4A7C7E", "#0f3460"],
    ["#DAA520", "#6B9B9D", "#1a1a2e"],
  ];
  const pal = palettes[pick(b, 0, palettes.length)];
  const stroke = pal[0];
  const fill = pal[1];
  const bg = pal[2];

  const layers: string[] = [];

  layers.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="1.5" opacity="0.6"/>`);

  const sides = 3 + pick(b, 1, 6);
  const innerR = r * (0.5 + pick(b, 2, 30) / 100);
  const rot = (pick(b, 3, 360) * Math.PI) / 180;
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = rot + (2 * Math.PI * i) / sides;
    points.push(`${cx + innerR * Math.cos(angle)},${cy + innerR * Math.sin(angle)}`);
  }
  layers.push(`<polygon points="${points.join(" ")}" fill="none" stroke="${fill}" stroke-width="1" opacity="0.7"/>`);

  const lineCount = 3 + pick(b, 4, 5);
  for (let i = 0; i < lineCount; i++) {
    const angle = (2 * Math.PI * i) / lineCount + rot * 0.5;
    const x1 = cx + r * 0.2 * Math.cos(angle);
    const y1 = cy + r * 0.2 * Math.sin(angle);
    const x2 = cx + r * 0.85 * Math.cos(angle);
    const y2 = cy + r * 0.85 * Math.sin(angle);
    layers.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="0.5" opacity="0.4"/>`);
  }

  layers.push(`<circle cx="${cx}" cy="${cy}" r="${size * 0.02}" fill="${stroke}"/>`);

  const dotCount = 4 + pick(b, 5, 5);
  const orbitR = r * (0.3 + pick(b, 6, 40) / 100);
  for (let i = 0; i < dotCount; i++) {
    const angle = (2 * Math.PI * i) / dotCount + (pick(b, 7 + i, 60) * Math.PI) / 180;
    const dx = cx + orbitR * Math.cos(angle);
    const dy = cy + orbitR * Math.sin(angle);
    layers.push(`<circle cx="${dx}" cy="${dy}" r="${size * 0.008 + pick(b, 8 + i, 4)}" fill="${fill}" opacity="0.8"/>`);
  }

  const segCount = 6 + pick(b, 12, 6);
  for (let i = 0; i < segCount; i++) {
    const a1 = (2 * Math.PI * i) / segCount;
    const a2 = a1 + (2 * Math.PI * 0.6) / segCount;
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    layers.push(`<path d="M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}" fill="none" stroke="${stroke}" stroke-width="2" opacity="0.3"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  ${layers.join("\n  ")}
</svg>`;
}

export function sigilToDataURI(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function sigilToBytes(svg: string): Uint8Array {
  return new TextEncoder().encode(svg);
}
