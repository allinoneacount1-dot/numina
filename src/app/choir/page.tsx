'use client';

import { motion } from 'framer-motion';
import { mockChoir } from '@/content/site';

export default function ChoirPage() {
  const totalPnl = mockChoir.reduce((sum, c) => sum + c.pnl, 0);
  const totalActions = mockChoir.reduce((sum, c) => sum + c.actions, 0);

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-wider text-text-hi mb-2">
          The Choir
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid mb-10">
          Collective intelligence. The strongest signals rise.
        </p>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Active Numina', value: mockChoir.filter(c => c.status === 'awake').length.toString() },
            { label: 'Total PnL', value: `${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(0)} SOL` },
            { label: 'Total Actions', value: totalActions.toLocaleString() },
            { label: 'Strategies', value: '6' },
          ].map((stat) => (
            <div key={stat.label} className="border border-line/50 bg-surface-700 p-4 text-center">
              <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider mb-2">
                {stat.label}
              </p>
              <p className="font-[family-name:var(--font-display)] text-lg text-gold-500">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Leaderboard table */}
        <div className="border border-line/50 bg-surface-700 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[60px_1fr_100px_100px_100px_80px] gap-4 px-6 py-3 border-b border-line/50">
            <span className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider">#</span>
            <span className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider">Name</span>
            <span className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider text-right">PnL</span>
            <span className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider text-right">Actions</span>
            <span className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider text-right">Followers</span>
            <span className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider text-right">Status</span>
          </div>

          {/* Rows */}
          {mockChoir.map((row, i) => (
            <motion.div
              key={row.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="grid grid-cols-[60px_1fr_100px_100px_100px_80px] gap-4 px-6 py-4 border-b border-line/20 last:border-0 hover:bg-surface-600/50 transition-colors"
            >
              <span className="font-[family-name:var(--font-mono)] text-xs text-text-low">
                {row.rank}
              </span>
              <span className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi">
                {row.name}
              </span>
              <span className={`font-[family-name:var(--font-mono)] text-xs text-right ${row.pnl >= 0 ? 'text-plasma-400' : 'text-danger'}`}>
                {row.pnl >= 0 ? '+' : ''}{row.pnl.toFixed(2)}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-xs text-text-hi text-right">
                {row.actions.toLocaleString()}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-xs text-text-mid text-right">
                {row.followers}
              </span>
              <span className={`font-[family-name:var(--font-mono)] text-[10px] text-right uppercase tracking-wider ${row.status === 'awake' ? 'text-success' : 'text-text-low'}`}>
                {row.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
