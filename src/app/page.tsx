"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  Lightning,
  Link as LinkIcon,
  Eye,
  ArrowRight,
  Shield,
  Lock,
  XCircle,
} from "@phosphor-icons/react";
import { StarfieldCanvas } from "@/components/StarfieldCanvas";
import { SigilAvatar } from "@/components/SigilAvatar";
import { mockNumina, mockStrategies } from "@/content/site";

const premiseCards = [
  {
    Icon: Lightning,
    title: "Invoke",
    desc: "Name your Numen. Choose its purpose. Set its boundaries.",
  },
  {
    Icon: LinkIcon,
    title: "Bind",
    desc: "Sign the ritual. The chain accepts your terms. Guardrails lock on-chain.",
  },
  {
    Icon: Eye,
    title: "Awaken",
    desc: "Your Numen opens its eyes. It begins to act, observe, and serve.",
  },
];

const ritualSteps = [
  { num: "01", title: "Naming", desc: "Give your Numen a name and generate its Sigil." },
  { num: "02", title: "Purpose", desc: "Define what it does: trading, monitoring, or tasks." },
  { num: "03", title: "Strategy", desc: "Choose a template or write custom rules." },
  { num: "04", title: "Seal", desc: "Sign the transaction. Deploy on-chain. The Numen awakens." },
];

export default function LandingPage() {
  const activeCount = mockNumina.filter((n) => n.status === "awake").length;
  const totalActions = mockNumina.reduce((sum, n) => sum + n.actions, 0);
  const totalClones = mockStrategies.reduce((sum, s) => sum + s.clones, 0);

  return (
    <>
      {/* Hero — asymmetric left-aligned */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
        <StarfieldCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-void-900 via-transparent to-void-900 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(46,139,139,0.06)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl tracking-[0.06em] leading-[1.1] mb-6">
                  Summon intelligence.
                  <br />
                  <span className="text-gold-500 text-glow-gold">
                    Bind it to the chain.
                  </span>
                </h1>
              </motion.div>

              <motion.p
                className="font-[family-name:var(--font-body)] text-base text-text-mid max-w-md mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7 }}
              >
                Autonomous AI agents on Solana. They trade. They monitor. They
                act. While you sleep.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <Link
                  href="/sanctum"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-300 transition-all focus-ritual glow-gold"
                >
                  Open the Gate
                  <ArrowRight size={14} weight="bold" />
                </Link>
                <Link
                  href="/lore"
                  className="inline-flex items-center gap-2 px-8 py-3 border border-aether-500/30 text-aether-500 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase hover:bg-aether-500/10 transition-all focus-ritual"
                >
                  Read the Mythos
                </Link>
              </motion.div>
            </div>

            {/* Right: sigil */}
            <motion.div
              className="hidden lg:flex justify-end"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="sigil-rotate">
                <SigilAvatar seed="numina-genesis" size={280} label="NUMINA genesis sigil" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premise — asymmetric bento */}
      <section className="section-spacing px-4 md:px-8 border-t border-line/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premiseCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`border border-line/50 bg-surface-700 p-8 hover:border-aether-500/30 transition-all duration-300 ${
                  i === 1 ? "md:-translate-y-4" : ""
                }`}
              >
                <card.Icon
                  size={28}
                  weight="light"
                  className="text-gold-500 mb-4"
                  aria-hidden="true"
                />
                <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wider text-text-hi mb-3">
                  {card.title}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-sm text-text-mid leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live stats strip */}
      <section
        className="py-8 border-t border-b border-line/30 bg-surface-700/50"
        aria-label="Live protocol statistics"
      >
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center gap-8 md:gap-16">
          <div className="text-center">
            <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-gold-500 text-glow-gold">
              {activeCount}
            </p>
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mt-1">
              Numina Active
            </p>
          </div>
          <div className="w-px h-8 bg-line/50" aria-hidden="true" />
          <div className="text-center">
            <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-plasma-400">
              {totalActions.toLocaleString()}
            </p>
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mt-1">
              Actions Today
            </p>
          </div>
          <div className="w-px h-8 bg-line/50" aria-hidden="true" />
          <div className="text-center">
            <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-aether-500 text-glow-aether">
              {totalClones.toLocaleString()}
            </p>
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mt-1">
              Clones Deployed
            </p>
          </div>
        </div>
      </section>

      {/* How the Rite works — horizontal steps */}
      <section className="section-spacing px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-wider text-text-hi mb-12 text-center">
            How the Rite Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {ritualSteps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-aether-500/30 flex items-center justify-center">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-aether-500">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-sm tracking-wider text-gold-500 mb-2">
                  {step.title}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-sm text-text-mid leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured strategies — varied grid */}
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
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="border border-line/50 bg-surface-700 p-6 hover:border-gold-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi">
                    {strategy.title}
                  </h3>
                  <span
                    className={`font-[family-name:var(--font-mono)] text-xs px-2 py-0.5 uppercase tracking-wider rounded ${
                      strategy.riskLevel === "conservative"
                        ? "bg-plasma-400/10 text-plasma-400"
                        : strategy.riskLevel === "moderate"
                          ? "bg-gold-500/10 text-gold-500"
                          : "bg-danger/10 text-danger"
                    }`}
                  >
                    {strategy.riskLevel}
                  </span>
                </div>
                <p className="font-[family-name:var(--font-body)] text-sm text-text-mid leading-relaxed mb-4">
                  {strategy.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-line/30">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-plasma-400">
                    {strategy.roi > 0 ? "+" : ""}
                    {strategy.roi}% ROI
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs text-text-low">
                    {strategy.clones} clones
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/pantheon"
              className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs text-gold-500 hover:text-gold-300 transition-colors focus-ritual tracking-wider uppercase"
            >
              View All Strategies <ArrowRight size={12} weight="light" />
            </Link>
          </div>
        </div>
      </section>

      {/* Safety — three columns */}
      <section className="section-spacing px-4 md:px-8 border-t border-line/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-wider text-text-hi mb-6">
            Safety &amp; Sovereignty
          </h2>
          <p className="font-[family-name:var(--font-body)] text-sm text-text-mid leading-relaxed mb-8 max-w-lg mx-auto">
            Non-custodial by design. Your keys stay with you. On-chain
            guardrails enforce budget and risk limits. If the backend is
            compromised, the chain protects you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                Icon: Shield,
                title: "Non-Custodial",
                desc: "Private keys never leave your wallet",
              },
              {
                Icon: Lock,
                title: "On-Chain Limits",
                desc: "Budget & risk enforced by smart contract",
              },
              {
                Icon: XCircle,
                title: "Revocable",
                desc: "Revoke any Numen instantly",
              },
            ].map((item) => (
              <div key={item.title} className="border border-line/30 p-4">
                <item.Icon
                  size={20}
                  weight="light"
                  className="text-gold-500 mb-2 mx-auto"
                  aria-hidden="true"
                />
                <p className="font-[family-name:var(--font-display)] text-xs tracking-wider text-gold-500 mb-2">
                  {item.title}
                </p>
                <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid">
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
