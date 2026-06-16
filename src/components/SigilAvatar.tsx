"use client";

import { useMemo } from "react";
import { hashSeed, pick } from "@/lib/hash";

interface Props {
  seed: string;
  size?: number;
  className?: string;
  label?: string;
}

export function SigilAvatar({ seed, size = 64, className = "", label }: Props) {
  const elements = useMemo(() => {
    const b = hashSeed(seed);
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.4;

    const items: { type: string; props: Record<string, string | number> }[] = [];

    // Outer ring
    items.push({
      type: "circle",
      props: { cx, cy, r, fill: "none", stroke: "var(--color-aether-500, #2E8B8B)", strokeWidth: 1, opacity: 0.4 },
    });

    // Inner polygon
    const sides = 3 + pick(b, 0, 5);
    const innerR = r * (0.5 + pick(b, 1, 25) / 100);
    const rot = (pick(b, 2, 360) * Math.PI) / 180;
    const pts: string[] = [];
    for (let i = 0; i < sides; i++) {
      const a = rot + (2 * Math.PI * i) / sides;
      pts.push(`${cx + innerR * Math.cos(a)},${cy + innerR * Math.sin(a)}`);
    }
    items.push({
      type: "polygon",
      props: { points: pts.join(" "), fill: "none", stroke: "var(--color-aether-500, #2E8B8B)", strokeWidth: 1, opacity: 0.5 },
    });

    // Radial lines
    const lineCount = 3 + pick(b, 3, 4);
    for (let i = 0; i < lineCount; i++) {
      const a = (2 * Math.PI * i) / lineCount + rot * 0.5;
      items.push({
        type: "line",
        props: {
          x1: cx + r * 0.15 * Math.cos(a),
          y1: cy + r * 0.15 * Math.sin(a),
          x2: cx + r * 0.85 * Math.cos(a),
          y2: cy + r * 0.85 * Math.sin(a),
          stroke: "var(--color-gold-500, #C9A84C)",
          strokeWidth: 0.5,
          opacity: 0.3,
        },
      });
    }

    // Orbiting dots
    const dotCount = 4 + pick(b, 4, 4);
    const orbitR = r * (0.35 + pick(b, 5, 30) / 100);
    for (let i = 0; i < dotCount; i++) {
      const a = (2 * Math.PI * i) / dotCount + (pick(b, 6 + i, 60) * Math.PI) / 180;
      const dr = size * 0.006 + pick(b, 10 + i, 3) * 0.002 * size;
      items.push({
        type: "circle",
        props: {
          cx: cx + orbitR * Math.cos(a),
          cy: cy + orbitR * Math.sin(a),
          r: dr,
          fill: "var(--color-gold-500, #C9A84C)",
          opacity: 0.7,
        },
      });
    }

    // Center dot
    items.push({
      type: "circle",
      props: { cx, cy, r: size * 0.015, fill: "var(--color-gold-500, #C9A84C)" },
    });

    return items;
  }, [seed, size]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        role="img"
        aria-label={label || `Sigil for ${seed}`}
      >
        {elements.map((el, i) => {
          const Tag = el.type as "circle" | "polygon" | "line";
          return <Tag key={i} {...el.props} />;
        })}
      </svg>
    </div>
  );
}
