"use client";

interface Props {
  balance: number;
  energy: number;
  className?: string;
}

export function AetherMeter({ balance, energy, className = "" }: Props) {
  const maxEnergy = 100;
  const pct = Math.min((energy / maxEnergy) * 100, 100);

  return (
    <div className={`border border-line/50 bg-surface-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider">
          Aether
        </span>
        <span className="font-[family-name:var(--font-mono)] text-xs text-gold-500">
          $LMN
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-[family-name:var(--font-display)] text-2xl text-gold-500 text-glow-gold">
          {balance.toLocaleString()}
        </span>
        <span className="font-[family-name:var(--font-mono)] text-xs text-text-low">
          $LMN
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider">
            Energy
          </span>
          <span className="font-[family-name:var(--font-mono)] text-xs text-aether-500">
            {energy}/{maxEnergy}
          </span>
        </div>
        <div
          className="w-full h-1.5 bg-void-900 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={energy}
          aria-valuemin={0}
          aria-valuemax={maxEnergy}
          aria-label={`Energy: ${energy} of ${maxEnergy}`}
        >
          <div
            className="h-full bg-gradient-to-r from-aether-500 to-gold-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
