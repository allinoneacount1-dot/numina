'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { NumenCard } from '@/components/NumenCard';
import { AetherMeter } from '@/components/AetherMeter';
import { LogStream } from '@/components/LogStream';
import { mockNumina, mockActions } from '@/content/site';

export default function SanctumPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <motion.h1
              className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-wider text-text-hi mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              The Sanctum
            </motion.h1>
            <p className="font-[family-name:var(--font-body)] text-sm text-text-mid">
              Your Numina await. Monitor, invoke, and command.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <AetherMeter balance={12500} energy={78} />
            <Link
              href="/sanctum/invoke"
              className="inline-block px-6 py-3 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-300 transition-all focus-ritual glow-gold"
            >
              Begin the Rite
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Numen grid */}
          <div className="lg:col-span-2">
            {mockNumina.length === 0 ? (
              <div className="border border-line/50 bg-surface-700 p-12 text-center">
                <p className="font-[family-name:var(--font-display)] text-lg text-text-mid mb-4">
                  No Numina answer yet.
                </p>
                <p className="font-[family-name:var(--font-mono)] text-xs text-text-low mb-6">
                  Light the first. Begin the Rite to summon your first Numen.
                </p>
                <Link
                  href="/sanctum/invoke"
                  className="inline-block px-6 py-3 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-300 transition-all focus-ritual"
                >
                  Begin the Rite
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockNumina.map((numen, i) => (
                  <motion.div
                    key={numen.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <NumenCard numen={numen} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* LogStream panel */}
          <div className="lg:col-span-1">
            <div className="border border-line/50 bg-surface-700 p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-[family-name:var(--font-mono)] text-[10px] text-text-low uppercase tracking-wider">
                  Activity Log
                </h3>
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              </div>
              <LogStream actions={mockActions} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
