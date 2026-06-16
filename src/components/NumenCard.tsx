'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SigilAvatar } from './SigilAvatar';
import type { Numen } from '@/content/site';

interface Props {
  numen: Numen;
}

export function NumenCard({ numen }: Props) {
  const statusColor = numen.status === 'awake' ? 'text-success' : numen.status === 'failed' ? 'text-danger' : 'text-text-low';
  const statusGlow = numen.status === 'awake' ? 'glow-aether' : '';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <Link
        href={`/numen/${numen.id}`}
        className={`block border border-line/50 bg-surface-700 p-6 hover:border-aether-500/30 transition-all duration-300 ${statusGlow}`}
      >
        <div className="flex items-start gap-4">
          <div className={numen.status === 'awake' ? 'sigil-rotate' : ''}>
            <SigilAvatar seed={numen.sigilSeed} size={48} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi truncate">
                {numen.name}
              </h3>
              <span className={`text-[9px] font-[family-name:var(--font-mono)] uppercase tracking-wider ${statusColor}`}>
                {numen.status}
              </span>
            </div>
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-low uppercase tracking-wider">
              {numen.purpose}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-line/30">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider mb-1">
              PnL
            </p>
            <p className={`font-[family-name:var(--font-mono)] text-sm font-medium ${numen.pnl >= 0 ? 'text-plasma-400' : 'text-danger'}`}>
              {numen.pnl >= 0 ? '+' : ''}{numen.pnl.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider mb-1">
              Win Rate
            </p>
            <p className="font-[family-name:var(--font-mono)] text-sm font-medium text-text-hi">
              {numen.winRate > 0 ? `${numen.winRate}%` : '--'}
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider mb-1">
              Actions
            </p>
            <p className="font-[family-name:var(--font-mono)] text-sm font-medium text-text-hi">
              {numen.actions.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[9px] text-text-low">
            Last: {numen.lastAction}
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[9px] text-aether-500 tracking-wider uppercase">
            View &rarr;
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
