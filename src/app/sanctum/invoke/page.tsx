'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiteStepper } from '@/components/RiteStepper';
import { SigilAvatar } from '@/components/SigilAvatar';

const STEPS = ['Naming', 'Purpose', 'Strategy', 'Bounds', 'Tithe', 'Seal'];

const PURPOSES = [
  { value: 'trading', label: 'Trading', desc: 'Automated trading on Solana DEXs' },
  { value: 'monitor', label: 'Monitor', desc: 'Track wallets, prices, and on-chain events' },
  { value: 'task', label: 'Task', desc: 'Automate recurring on-chain tasks' },
];

const STRATEGIES = [
  { value: 'momentum', label: 'Momentum Hunter', desc: 'Rides breakout trends on major pairs' },
  { value: 'whale', label: 'Whale Shadow', desc: 'Tracks and copies top wallet activity' },
  { value: 'compound', label: 'Stable Compounder', desc: 'Auto-compounds DeFi yields' },
  { value: 'custom', label: 'Custom Rules', desc: 'Write your own strategy logic' },
];

export default function InvokePage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [strategy, setStrategy] = useState('');
  const [budget, setBudget] = useState('1000');
  const [risk, setRisk] = useState('15');
  const [maxPerTx, setMaxPerTx] = useState('100');
  const [isComplete, setIsComplete] = useState(false);

  const sigilSeed = name ? name.toLowerCase().replace(/\s+/g, '-') : 'preview';

  const handleSeal = () => {
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="sigil-rotate mb-8">
            <SigilAvatar seed={sigilSeed} size={120} />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-wider text-gold-500 text-glow-gold mb-4">
            Your Numen is awake.
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid mb-8">
            {name} has been bound to the chain. It begins its work now.
          </p>
          <a
            href="/sanctum"
            className="inline-block px-8 py-3 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-300 transition-all focus-ritual"
          >
            Return to the Sanctum
          </a>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-wider text-text-hi mb-2 text-center">
          The Rite
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid text-center mb-10">
          Six steps to bind a Numen to your will.
        </p>

        <div className="flex justify-center mb-12">
          <RiteStepper steps={STEPS} currentStep={step} onStepClick={setStep} />
        </div>

        <div className="border border-line/50 bg-surface-700 p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="naming"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wider text-text-hi mb-6">
                  Name Your Numen
                </h2>
                <div className="flex items-center gap-6">
                  <div>
                    <SigilAvatar seed={sigilSeed} size={80} />
                  </div>
                  <div className="flex-1">
                    <label className="font-[family-name:var(--font-mono)] text-[10px] text-text-low uppercase tracking-wider block mb-2">
                      Numen Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. AEGIS, ORACLE, WRAITH"
                      className="w-full bg-void-900 border border-line/50 px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-hi placeholder:text-text-low focus:outline-none focus:border-aether-500/50 transition-colors"
                    />
                    <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low mt-2">
                      Your Sigil is generated deterministically from this name.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="purpose"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wider text-text-hi mb-6">
                  Define Its Purpose
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PURPOSES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPurpose(p.value)}
                      className={`border p-5 text-left transition-all ${
                        purpose === p.value
                          ? 'border-aether-500 bg-aether-500/10'
                          : 'border-line/50 bg-surface-600 hover:border-line'
                      }`}
                    >
                      <p className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi mb-2">
                        {p.label}
                      </p>
                      <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-mid">
                        {p.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="strategy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wider text-text-hi mb-6">
                  Choose Strategy
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {STRATEGIES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStrategy(s.value)}
                      className={`border p-5 text-left transition-all ${
                        strategy === s.value
                          ? 'border-aether-500 bg-aether-500/10'
                          : 'border-line/50 bg-surface-600 hover:border-line'
                      }`}
                    >
                      <p className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi mb-2">
                        {s.label}
                      </p>
                      <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-mid">
                        {s.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="bounds"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wider text-text-hi mb-6">
                  Set Boundaries
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="font-[family-name:var(--font-mono)] text-[10px] text-text-low uppercase tracking-wider block mb-2">
                      Budget (SOL)
                    </label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-void-900 border border-line/50 px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-hi focus:outline-none focus:border-aether-500/50 transition-colors"
                    />
                    <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low mt-2">
                      Maximum SOL this Numen can use. Enforced on-chain.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-[family-name:var(--font-mono)] text-[10px] text-text-low uppercase tracking-wider block mb-2">
                        Risk Limit (%)
                      </label>
                      <input
                        type="number"
                        value={risk}
                        onChange={(e) => setRisk(e.target.value)}
                        className="w-full bg-void-900 border border-line/50 px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-hi focus:outline-none focus:border-aether-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-[family-name:var(--font-mono)] text-[10px] text-text-low uppercase tracking-wider block mb-2">
                        Max Per Transaction (SOL)
                      </label>
                      <input
                        type="number"
                        value={maxPerTx}
                        onChange={(e) => setMaxPerTx(e.target.value)}
                        className="w-full bg-void-900 border border-line/50 px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-hi focus:outline-none focus:border-aether-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="tithe"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wider text-text-hi mb-6">
                  Pay the Tithe
                </h2>
                <div className="border border-gold-500/30 bg-gold-500/5 p-6 text-center">
                  <p className="font-[family-name:var(--font-display)] text-3xl text-gold-500 text-glow-gold mb-2">
                    10 $LMN
                  </p>
                  <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-mid mb-4">
                    Energy required to awaken this Numen
                  </p>
                  <div className="w-full h-2 bg-void-900 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-aether-500 to-gold-500 rounded-full" />
                  </div>
                  <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low mt-2">
                    Your Aether: 78/100 energy
                  </p>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="seal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wider text-text-hi mb-6">
                  Seal the Binding
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-2 border-b border-line/30">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-low uppercase tracking-wider">Name</span>
                    <span className="font-[family-name:var(--font-mono)] text-xs text-text-hi">{name || 'Unnamed'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-line/30">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-low uppercase tracking-wider">Purpose</span>
                    <span className="font-[family-name:var(--font-mono)] text-xs text-text-hi capitalize">{purpose || 'Not set'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-line/30">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-low uppercase tracking-wider">Strategy</span>
                    <span className="font-[family-name:var(--font-mono)] text-xs text-text-hi capitalize">{strategy || 'Not set'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-line/30">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-low uppercase tracking-wider">Budget</span>
                    <span className="font-[family-name:var(--font-mono)] text-xs text-text-hi">{budget} SOL</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-line/30">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-low uppercase tracking-wider">Risk</span>
                    <span className="font-[family-name:var(--font-mono)] text-xs text-text-hi">{risk}%</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-low uppercase tracking-wider">Max/Tx</span>
                    <span className="font-[family-name:var(--font-mono)] text-xs text-text-hi">{maxPerTx} SOL</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-low mb-4">
                    Signing will create a program account, mint your Sigil NFT, and store config on-chain.
                  </p>
                  <button
                    onClick={handleSeal}
                    className="px-10 py-4 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-300 transition-all focus-ritual glow-gold"
                  >
                    Seal the Binding
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-line/30">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="font-[family-name:var(--font-mono)] text-xs text-text-mid hover:text-text-hi transition-colors focus-ritual disabled:opacity-30 disabled:cursor-not-allowed"
            >
              &larr; Back
            </button>
            {step < 5 && (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 border border-aether-500/30 text-aether-500 font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase hover:bg-aether-500/10 transition-all focus-ritual"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
