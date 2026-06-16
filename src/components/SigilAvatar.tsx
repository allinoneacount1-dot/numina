'use client';

import { useMemo } from 'react';

interface Props {
  seed: string;
  size?: number;
  className?: string;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function SigilAvatar({ seed, size = 64, className = '' }: Props) {
  const paths = useMemo(() => {
    const h = hashSeed(seed);
    const segments: string[] = [];
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;

    for (let i = 0; i < 6; i++) {
      const angle = ((h >> (i * 5)) % 360) * (Math.PI / 180);
      const nextAngle = ((h >> ((i + 1) * 5)) % 360) * (Math.PI / 180);
      const x1 = cx + r * Math.cos(angle);
      const y1 = cy + r * Math.sin(angle);
      const x2 = cx + r * Math.cos(nextAngle);
      const y2 = cy + r * Math.sin(nextAngle);
      segments.push(`M ${x1} ${y1} L ${x2} ${y2}`);
    }

    const innerR = r * 0.5;
    for (let i = 0; i < 4; i++) {
      const angle = ((h >> (i * 7 + 20)) % 360) * (Math.PI / 180);
      const x = cx + innerR * Math.cos(angle);
      const y = cy + innerR * Math.sin(angle);
      segments.push(`M ${cx} ${cy} L ${x} ${y}`);
    }

    return segments;
  }, [seed, size]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.42}
          className="text-aether-500/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.38}
          className="text-gold-500/20"
          strokeDasharray="4 4"
        />
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            className={i < 6 ? 'text-aether-500/60' : 'text-gold-500/40'}
            strokeWidth={i < 6 ? 1.5 : 1}
          />
        ))}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={3}
          className="text-gold-500"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
