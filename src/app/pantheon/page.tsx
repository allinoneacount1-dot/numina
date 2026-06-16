'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockStrategies } from '@/content/site';

const RISK_FILTERS = ['all', 'conservative', 'moderate', 'aggressive'];

export default function PantheonPage() {
  const [riskFilter, setRiskFilter] = useState('all');

  const filtered = riskFilter === 'all'
    ? mockStrategies
    : mockStrategies.filter(s => s.riskLevel === riskFilter);

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-wider text-text-hi mb-2">
          The Pantheon
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid mb-10">
          Discover strategies. Clone a Numen. Make it yours.
        </p>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto">
          {RISK_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setRiskFilter(filter)}
              className={`px-4 py-2 font-[family-name:var(--font-mono)] text-[10px] tracking-wider uppercase transition-all whitespace-nowrap ${
                riskFilter === filter
                  ? 'bg-aether-500 text-void-900'
                  : 'border border-line/50 text-text-mid hover:border-aether-500/30 hover:text-text-hi'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Strategy grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((strategy, i) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="border border-line/50 bg-surface-700 p-6 hover:border-gold-500/30 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi">
                  {strategy.title}
                </h3>
                <span className={`font-[family-name:var(--font-mono)] text-[9px] px-2 py-0.5 uppercase tracking-wider rounded ${
                  strategy.riskLevel === 'conservative' ? 'bg-plasma-400/10 text-plasma-400' :
                  strategy.riskLevel === 'moderate' ? 'bg-gold-500/10 text-gold-500' :
                  'bg-danger/10 text-danger'
                }`}>
                  {strategy.riskLevel}
                </span>
              </div>

              <p className="font-[family-name:var(--font-body)] text-[11px] text-text-mid leading-relaxed mb-4">
                {strategy.description}
              </p>

              <div className="bg-void-900 border border-line/30 p-3 mb-4">
                <p className="font-[family-name:var(--font-mono)] text-[10px] text-plasma-400 leading-relaxed">
                  {strategy.rules}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-line/30">
                <div className="flex items-center gap-4">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-plasma-400">
                    {strategy.roi > 0 ? '+' : ''}{strategy.roi}% ROI
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-low">
                    {strategy.asset}
                  </span>
                </div>
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-low">
                  {strategy.clones} clones
                </span>
              </div>

              <button className="w-full mt-4 px-4 py-2 border border-gold-500/30 text-gold-500 font-[family-name:var(--font-mono)] text-[10px] tracking-wider uppercase hover:bg-gold-500/10 transition-all focus-ritual opacity-0 group-hover:opacity-100">
                Clone this Numen
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
