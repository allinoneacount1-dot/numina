'use client';

import { motion } from 'framer-motion';
import type { Action } from '@/content/site';

interface Props {
  actions: Action[];
}

export function LogStream({ actions }: Props) {
  const kindIcon = (kind: string) => {
    switch (kind) {
      case 'trade': return { symbol: '&#9670;', color: 'text-plasma-400' };
      case 'alert': return { symbol: '&#9888;', color: 'text-warning' };
      default: return { symbol: '&#9673;', color: 'text-aether-500' };
    }
  };

  return (
    <div className="space-y-2">
      {actions.map((action, i) => {
        const { symbol, color } = kindIcon(action.kind);
        return (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex items-start gap-3 py-2 border-b border-line/20 last:border-0"
          >
            <span className={`font-[family-name:var(--font-mono)] text-xs ${color}`} dangerouslySetInnerHTML={{ __html: symbol }} />
            <div className="flex-1 min-w-0">
              <p className="font-[family-name:var(--font-mono)] text-[11px] text-text-hi truncate">
                {action.payload}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-[family-name:var(--font-mono)] text-[9px] text-text-low">
                  {action.createdAt}
                </span>
                {action.txSig && (
                  <span className="font-[family-name:var(--font-mono)] text-[9px] text-aether-500">
                    {action.txSig}
                  </span>
                )}
                {action.pnl !== undefined && action.pnl !== null && (
                  <span className={`font-[family-name:var(--font-mono)] text-[9px] ${action.pnl >= 0 ? 'text-plasma-400' : 'text-danger'}`}>
                    {action.pnl >= 0 ? '+' : ''}{action.pnl}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
