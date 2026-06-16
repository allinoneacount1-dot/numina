'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { StarfieldCanvas } from '@/components/StarfieldCanvas';
import { SigilAvatar } from '@/components/SigilAvatar';
import { mockNumina, mockStrategies } from '@/content/site';

const premiseCards = [
  { title: 'Invoke', desc: 'Name your Numen. Choose its purpose. Set its boundaries.', icon: '&#9670;' },
  { title: 'Bind', desc: 'Sign the ritual. The chain accepts your terms. Guardrails lock on-chain.', icon: '&#9674;' },
  { title: 'Awaken', desc: 'Your Numen opens its eyes. It begins to act, observe, and serve.', icon: '&#9673;' },
];

const ritualSteps = [
  { step: '01', title: 'Naming', desc: 'Give your Numen a name and generate its Sigil.' },
  { step: '02', title: 'Purpose', desc: 'Define what it does: trading, monitoring, or tasks.' },
  { step: '03', title: 'Strategy', desc: 'Choose a template or write custom rules.' },
  { step: '04', title: 'Seal', desc: 'Sign the transaction. Deploy on-chain. The Numen awakens.' },
];

export default function GatePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <StarfieldCanvas />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-void-900 via-transparent to-void-900 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(123,92,255,0.08)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24 pb-16">
          {/* Rotating sigil */}
          <motion.div
            className="mx-auto mb-12 sigil-rotate"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <SigilAvatar seed="numina-genesis" size={160} />
          </motion.div>

          <motion.h1
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl tracking-[0.08em] leading-[1.05] mb-6 text-glow-gold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Summon intelligence.
            <br />
            <span className="text-gold-500">Bind it to the chain.</span>
          </motion.h1>

          <motion.p
            className="font-[family-name:var(--font-body)] text-sm md:text-base text-text-mid max-w-lg mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Autonomous AI agents on Solana. They trade. They monitor. They act.
            While you sleep.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link
              href="/sanctum"
              className="inline-block px-8 py-3 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-300 transition-all focus-ritual glow-gold"
            >
              Open the Gate
            </Link>
            <Link
              href="/lore"
              className="inline-block px-8 py-3 border border-aether-500/30 text-aether-500 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase hover:bg-aether-500/10 transition-all focus-ritual"
            >
              Read the Mythos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* The Premise */}
      <section className="section-spacing px-4 md:px-8 border-t border-line/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premiseCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="border border-line/50 bg-surface-700 p-8 hover:border-aether-500/30 transition-all duration-300"
              >
                <span className="font-[family-name:var(--font-mono)] text-xl text-gold-500 mb-4 block" dangerouslySetInnerHTML={{ __html: card.icon }} />
                <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wider text-text-hi mb-3">
                  {card.title}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-xs text-text-mid leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Choir strip */}
      <section className="py-8 border-t border-b border-line/30 bg-surface-700/50">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center gap-8 md:gap-16">
          <div className="text-center">
            <motion.p
              className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-gold-500 text-glow-gold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {mockNumina.filter(n => n.status === 'awake').length}
            </motion.p>
            <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider mt-1">
              Numina Active
            </p>
          </div>
          <div className="w-px h-8 bg-line/50" />
          <div className="text-center">
            <motion.p
              className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-plasma-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {mockNumina.reduce((sum, n) => sum + n.actions, 0).toLocaleString()}
            </motion.p>
            <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider mt-1">
              Actions Today
            </p>
          </div>
          <div className="w-px h-8 bg-line/50" />
          <div className="text-center">
            <motion.p
              className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-aether-500 text-glow-aether"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {mockStrategies.reduce((sum, s) => sum + s.clones, 0).toLocaleString()}
            </motion.p>
            <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low uppercase tracking-wider mt-1">
              Clones Deployed
            </p>
          </div>
        </div>
      </section>

      {/* How the Rite works */}
      <section className="section-spacing px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-wider text-text-hi mb-12 text-center">
            How the Rite Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {ritualSteps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-aether-500/30 flex items-center justify-center">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-aether-500">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-sm tracking-wider text-gold-500 mb-2">
                  {item.title}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[11px] text-text-mid leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured strategies */}
      <section className="section-spacing px-4 md:px-8 border-t border-line/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-wider text-text-hi mb-12 text-center">
            Featured Strategies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockStrategies.slice(0, 3).map((strategy, i) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="border border-line/50 bg-surface-700 p-6 hover:border-gold-500/30 transition-all duration-300"
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
                <div className="flex items-center justify-between pt-3 border-t border-line/30">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-plasma-400">
                    {strategy.roi > 0 ? '+' : ''}{strategy.roi}% ROI
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-low">
                    {strategy.clones} clones
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/pantheon" className="font-[family-name:var(--font-mono)] text-xs text-gold-500 hover:text-gold-300 transition-colors focus-ritual tracking-wider uppercase">
              View All Strategies &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="section-spacing px-4 md:px-8 border-t border-line/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-wider text-text-hi mb-6">
            Safety & Sovereignty
          </h2>
          <p className="font-[family-name:var(--font-body)] text-sm text-text-mid leading-relaxed mb-8 max-w-lg mx-auto">
            Non-custodial by design. Your keys stay with you. On-chain guardrails enforce budget and risk limits. If the backend is compromised, the chain protects you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Non-Custodial', desc: 'Private keys never leave your wallet' },
              { label: 'On-Chain Limits', desc: 'Budget & risk enforced by smart contract' },
              { label: 'Revocable', desc: 'Revoke any Numen instantly' },
            ].map((item) => (
              <div key={item.label} className="border border-line/30 p-4">
                <p className="font-[family-name:var(--font-display)] text-xs tracking-wider text-gold-500 mb-2">
                  {item.label}
                </p>
                <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-mid">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
