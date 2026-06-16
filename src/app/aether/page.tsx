"use client";

import { useState } from "react";
import { AetherMeter } from "@/components/AetherMeter";

export default function AetherPage() {
  const [stakeAmount, setStakeAmount] = useState("");

  const treasuryStats = [
    { label: "Total Staked", value: "847,230 $LMN" },
    { label: "Stakers", value: "2,341" },
    { label: "APY", value: "12.4%" },
    { label: "Energy Pool", value: "78,420" },
  ];

  const energyRules = [
    { action: "Invoke a Numen", cost: "10 energy" },
    { action: "Clone a strategy", cost: "5 energy" },
    { action: "Awaken from Silence", cost: "3 energy" },
    { action: "Energy regenerates", value: "1 per hour" },
  ];

  return (
    <main className="min-h-[100dvh] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-wider text-text-hi mb-2">
          The Aether
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid mb-10">
          Staking. Treasury. The source of all energy.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Stake/Unstake */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-line/50 bg-surface-700 p-6">
              <h2 className="font-[family-name:var(--font-display)] text-lg tracking-wider text-text-hi mb-6">
                Stake $LMN
              </h2>
              <p className="font-[family-name:var(--font-body)] text-sm text-text-mid mb-6">
                Stake $LMN to earn energy for invoking and controlling your
                Numina. Higher stake = more energy = more agents.
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <label
                    htmlFor="stake-amount"
                    className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider block mb-2"
                  >
                    Amount
                  </label>
                  <input
                    id="stake-amount"
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1"
                    className="w-full bg-void-900 border border-line/50 px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-text-hi placeholder:text-text-low focus:outline-none focus:border-aether-500/50 transition-colors"
                  />
                </div>
                <div className="pt-6">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-text-low">
                    $LMN
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-300 transition-all focus-ritual">
                  Stake
                </button>
                <button className="flex-1 px-4 py-3 border border-line/50 text-text-mid font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase hover:border-aether-500/30 hover:text-text-hi transition-all focus-ritual">
                  Unstake
                </button>
              </div>
            </div>

            {/* Treasury stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {treasuryStats.map((stat) => (
                <div
                  key={stat.label}
                  className="border border-line/50 bg-surface-700 p-4 text-center"
                >
                  <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mb-2">
                    {stat.label}
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-sm text-gold-500">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Energy mechanics */}
            <div className="border border-line/50 bg-surface-700 p-6">
              <h3 className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi mb-4">
                Energy Mechanics
              </h3>
              <div className="space-y-3">
                {energyRules.map((rule) => (
                  <div
                    key={rule.action}
                    className="flex items-center justify-between py-2 border-b border-line/20 last:border-0"
                  >
                    <span className="font-[family-name:var(--font-mono)] text-xs text-text-mid">
                      {rule.action}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-xs text-aether-500">
                      {rule.cost || rule.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: AetherMeter */}
          <div className="lg:col-span-1">
            <AetherMeter balance={12500} energy={78} className="mb-6" />

            <div className="border border-line/50 bg-surface-700 p-4">
              <h3 className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mb-4">
                Your Stakes
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-line/20">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-text-mid">
                    Staked
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs text-gold-500">
                    12,500 $LMN
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-line/20">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-text-mid">
                    Earned
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs text-plasma-400">
                    +1,247 $LMN
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-text-mid">
                    Lock
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs text-text-hi">
                    None
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
