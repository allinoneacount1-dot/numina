'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SigilAvatar } from '@/components/SigilAvatar';
import { AetherMeter } from '@/components/AetherMeter';
import { LogStream } from '@/components/LogStream';
import { mockNumina, mockActions } from '@/content/site';

const TABS = ['Overview', 'Strategy', 'Activity', 'Performance'];

export default function NumenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [activeTab, setActiveTab] = useState('Overview');

  // In real app, fetch from Supabase by params.id
  const numen = mockNumina[0];
  const numenActions = mockActions.filter(a => a.numenId === numen.id);

  const statusColor = numen.status === 'awake' ? 'text-success' : numen.status === 'failed' ? 'text-danger' : 'text-text-low';

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/sanctum" className="font-[family-name:var(--font-mono)] text-[10px] text-text-low hover:text-aether-500 transition-colors focus-ritual tracking-wider uppercase mb-8 inline-block">
          &larr; Back to Sanctum
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
          <div className={numen.status === 'awake' ? 'sigil-rotate' : ''}>
            <SigilAvatar seed={numen.sigilSeed} size={96} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-wider text-text-hi">
                {numen.name}
              </h1>
              <span className={`font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                numen.status === 'awake' ? 'border-success/30 text-success' : 'border-line/50 text-text-low'
              }`}>
                {numen.status}
              </span>
            </div>
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-low uppercase tracking-wider">
              {numen.purpose} agent &middot; Last active {numen.lastAction}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-aether-500/30 text-aether-500 font-[family-name:var(--font-mono)] text-[10px] tracking-wider uppercase hover:bg-aether-500/10 transition-all focus-ritual">
              {numen.status === 'awake' ? 'Silence' : 'Awaken'}
            </button>
            <button className="px-4 py-2 border border-gold-500/30 text-gold-500 font-[family-name:var(--font-mono)] text-[10px] tracking-wider uppercase hover:bg-gold-500/10 transition-all focus-ritual">
              Tithe
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-line/50 mb-8 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] tracking-wider uppercase transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'text-gold-500 border-b-2 border-gold-500'
                  : 'text-text-low hover:text-text-mid'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'Overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'PnL', value: `${numen.pnl >= 0 ? '+' : ''}${numen.pnl.toFixed(2)} SOL`, color: numen.pnl >= 0 ? 'text-plasma-400' : 'text-danger' },
                { label: 'Win Rate', value: `${numen.winRate}%`, color: 'text-text-hi' },
                { label: 'Actions', value: numen.actions.toLocaleString(), color: 'text-text-hi' },
                { label: 'Uptime', value: numen.uptime, color: 'text-success' },
              ].map((stat) => (
                <div key={stat.label} className="border border-line/50 bg-surface-700 p-4">
                  <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider mb-2">
                    {stat.label}
                  </p>
                  <p className={`font-[family-name:var(--font-display)] text-xl ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            <AetherMeter balance={12500} energy={78} />
          </motion.div>
        )}

        {activeTab === 'Strategy' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-line/50 bg-surface-700 p-6"
          >
            <h3 className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi mb-4">
              Active Rules
            </h3>
            <div className="bg-void-900 border border-line/30 p-4 font-[family-name:var(--font-mono)] text-xs text-plasma-400 leading-relaxed">
              {numen.config.rules}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-line/30">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider mb-1">Budget</p>
                <p className="font-[family-name:var(--font-mono)] text-sm text-text-hi">{numen.config.budget} SOL</p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider mb-1">Risk</p>
                <p className="font-[family-name:var(--font-mono)] text-sm text-text-hi">{numen.config.risk}%</p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider mb-1">Max/Tx</p>
                <p className="font-[family-name:var(--font-mono)] text-sm text-text-hi">{numen.config.maxPerTx} SOL</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Activity' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-line/50 bg-surface-700 p-4"
          >
            <LogStream actions={numenActions.length > 0 ? numenActions : mockActions} />
          </motion.div>
        )}

        {activeTab === 'Performance' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-line/50 bg-surface-700 p-8"
          >
            <div className="h-48 flex items-center justify-center border border-line/30 bg-void-900 mb-6">
              <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-low">
                Equity curve chart (connect Supabase for live data)
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Trades', value: '1,842' },
                { label: 'Avg Hold', value: '2.4h' },
                { label: 'Best Trade', value: '+45.2 SOL' },
                { label: 'Worst Trade', value: '-12.8 SOL' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p className="font-[family-name:var(--font-mono)] text-sm text-text-hi">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
