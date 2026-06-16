"use client";

import { useRef, useEffect, useCallback } from "react";

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; desc?: string }[];
  label: string;
}

export function RadioGroup({ value, onChange, options, label }: RadioGroupProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, options.length - 1));
      refs.current[clamped]?.focus();
    },
    [options.length]
  );

  useEffect(() => {
    const container = refs.current[0]?.closest("[role='radiogroup']");
    if (!container) return;

    const handleKey = (e: Event) => {
      const ke = e as KeyboardEvent;
      const currentIndex = options.findIndex(
        (_, i) => refs.current[i] === document.activeElement
      );
      if (currentIndex === -1) return;

      if (ke.key === "ArrowRight" || ke.key === "ArrowDown") {
        e.preventDefault();
        const next = (currentIndex + 1) % options.length;
        onChange(options[next].value);
        focusIndex(next);
      } else if (ke.key === "ArrowLeft" || ke.key === "ArrowUp") {
        e.preventDefault();
        const prev = (currentIndex - 1 + options.length) % options.length;
        onChange(options[prev].value);
        focusIndex(prev);
      }
    };

    container.addEventListener("keydown", handleKey);
    return () => container.removeEventListener("keydown", handleKey);
  }, [options, onChange, focusIndex]);

  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {options.map((opt, i) => (
        <button
          key={opt.value}
          ref={(el) => { refs.current[i] = el; }}
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`border p-5 text-left transition-all ${
            value === opt.value
              ? "border-aether-500 bg-aether-500/10"
              : "border-line/50 bg-surface-600 hover:border-line"
          }`}
        >
          <p className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi mb-2">
            {opt.label}
          </p>
          {opt.desc && (
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid">
              {opt.desc}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}
