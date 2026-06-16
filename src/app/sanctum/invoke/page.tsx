"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ArrowLeft, ArrowRight, Lightning, Warning } from "@phosphor-icons/react";
import { RiteStepper } from "@/components/RiteStepper";
import { SigilAvatar } from "@/components/SigilAvatar";
import { createNumen } from "@/lib/db";
import { mintSigil } from "@/lib/mint";

const STEPS = ["Naming", "Purpose", "Strategy", "Bounds", "Tithe", "Seal"];

const PURPOSES = [
  { value: "trading", label: "Trading", desc: "Automated trading on Solana DEXs" },
  { value: "monitor", label: "Monitor", desc: "Track wallets, prices, and on-chain events" },
  { value: "task", label: "Task", desc: "Automate recurring on-chain tasks" },
];

const STRATEGIES = [
  { value: "momentum", label: "Momentum Hunter", desc: "Rides breakout trends on major pairs" },
  { value: "whale", label: "Whale Shadow", desc: "Tracks and copies top wallet activity" },
  { value: "compound", label: "Stable Compounder", desc: "Auto-compounds DeFi yields" },
  { value: "custom", label: "Custom Rules", desc: "Write your own strategy logic" },
];

export default function InvokePage() {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [strategy, setStrategy] = useState("");
  const [budget, setBudget] = useState("1000");
  const [risk, setRisk] = useState("15");
  const [maxPerTx, setMaxPerTx] = useState("100");
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sigilSeed = name ? name.toLowerCase().replace(/\s+/g, "-") : "preview";

  const validate = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 0 && !name.trim()) {
      newErrors.name = "Name your Numen to continue";
    }
    if (currentStep === 0 && name.trim().length > 64) {
      newErrors.name = "Name must be 64 characters or less";
    }
    if (currentStep === 1 && !purpose) {
      newErrors.purpose = "Select a purpose";
    }
    if (currentStep === 2 && !strategy) {
      newErrors.strategy = "Choose a strategy";
    }
    if (currentStep === 3) {
      const budgetNum = Number(budget);
      const riskNum = Number(risk);
      const maxNum = Number(maxPerTx);
      if (!budget || budgetNum <= 0) newErrors.budget = "Set a budget greater than 0";
      if (budgetNum > 1_000_000) newErrors.budget = "Budget cannot exceed 1,000,000 SOL";
      if (risk === "" || riskNum < 0 || riskNum > 100) newErrors.risk = "Risk must be 0-100%";
      if (!maxPerTx || maxNum <= 0) newErrors.maxPerTx = "Set max per tx greater than 0";
      if (maxNum > budgetNum) newErrors.maxPerTx = "Max per tx cannot exceed budget";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validate(step)) setStep(step + 1);
  };

  const handleSeal = async () => {
    if (!publicKey) {
      setVisible(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create numen in Supabase
      await createNumen({
        owner: publicKey.toBase58(),
        name,
        strategy,
        status: "awake",
        budget_lamports: Number(budget) * 1_000_000_000,
        max_per_tx: Number(maxPerTx) * 1_000_000_000,
        on_chain_id: null,
      });

      // 2. Mint Sigil NFT
      try {
        const seed = `${publicKey.toBase58()}-${name}`.toLowerCase();
        const result = await mintSigil(seed, `${name} Sigil`, {
          publicKey: publicKey,
        });
        console.log("[invoke] Sigil minted:", result.mint);
      } catch (nftErr) {
        // NFT minting is non-critical on devnet
        console.warn("[invoke] NFT mint skipped:", nftErr);
      }

      setIsComplete(true);
    } catch (err) {
      console.error("[invoke]", err);
      setErrors({ submit: "Failed to create Numen. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!publicKey) {
    return (
      <main className="min-h-[100dvh] pt-24 pb-20 px-4 md:px-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-text-hi mb-4">
            The Rite
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid mb-8">
            Connect your wallet to begin the invocation.
          </p>
          <button
            onClick={() => setVisible(true)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-300 transition-all focus-ritual glow-gold"
          >
            <Lightning size={14} weight="fill" />
            Open the Gate
          </button>
        </div>
      </main>
    );
  }

  if (isComplete) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="sigil-rotate mb-8">
            <SigilAvatar seed={sigilSeed} size={120} label={`${name} sigil`} />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-wider text-gold-500 text-glow-gold mb-4">
            Your Numen is awake.
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid mb-8">
            {name} has been bound to the chain. It begins its work now.
          </p>
          <Link
            href="/sanctum"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-300 transition-all focus-ritual"
          >
            Return to the Sanctum
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] pt-24 pb-20 px-4 md:px-8">
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
                    <SigilAvatar seed={sigilSeed} size={80} label="Preview sigil" />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="numen-name"
                      className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider block mb-2"
                    >
                      Numen Name
                    </label>
                    <input
                      id="numen-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. AEGIS, ORACLE, WRAITH"
                      className="w-full bg-void-900 border border-line/50 px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-hi placeholder:text-text-low focus:outline-none focus:border-aether-500/50 transition-colors"
                      aria-describedby={errors.name ? "name-error" : undefined}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p id="name-error" className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-xs text-danger mt-2">
                        <Warning size={12} /> {errors.name}
                      </p>
                    )}
                    <p className="font-[family-name:var(--font-mono)] text-xs text-text-low mt-2">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup" aria-label="Select purpose">
                  {PURPOSES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPurpose(p.value)}
                      role="radio"
                      aria-checked={purpose === p.value}
                      className={`border p-5 text-left transition-all ${
                        purpose === p.value
                          ? "border-aether-500 bg-aether-500/10"
                          : "border-line/50 bg-surface-600 hover:border-line"
                      }`}
                    >
                      <p className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi mb-2">
                        {p.label}
                      </p>
                      <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid">
                        {p.desc}
                      </p>
                    </button>
                  ))}
                </div>
                {errors.purpose && (
                  <p className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-xs text-danger mt-3">
                    <Warning size={12} /> {errors.purpose}
                  </p>
                )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="radiogroup" aria-label="Select strategy">
                  {STRATEGIES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStrategy(s.value)}
                      role="radio"
                      aria-checked={strategy === s.value}
                      className={`border p-5 text-left transition-all ${
                        strategy === s.value
                          ? "border-aether-500 bg-aether-500/10"
                          : "border-line/50 bg-surface-600 hover:border-line"
                      }`}
                    >
                      <p className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi mb-2">
                        {s.label}
                      </p>
                      <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid">
                        {s.desc}
                      </p>
                    </button>
                  ))}
                </div>
                {errors.strategy && (
                  <p className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-xs text-danger mt-3">
                    <Warning size={12} /> {errors.strategy}
                  </p>
                )}
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
                    <label
                      htmlFor="budget"
                      className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider block mb-2"
                    >
                      Budget (SOL)
                    </label>
                    <input
                      id="budget"
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      min="0"
                      step="0.1"
                      className="w-full bg-void-900 border border-line/50 px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-hi focus:outline-none focus:border-aether-500/50 transition-colors"
                      aria-describedby={errors.budget ? "budget-error" : "budget-help"}
                      aria-invalid={!!errors.budget}
                    />
                    {errors.budget ? (
                      <p id="budget-error" className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-xs text-danger mt-2">
                        <Warning size={12} /> {errors.budget}
                      </p>
                    ) : (
                      <p id="budget-help" className="font-[family-name:var(--font-mono)] text-xs text-text-low mt-2">
                        Maximum SOL this Numen can use. Enforced on-chain.
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="risk"
                        className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider block mb-2"
                      >
                        Risk Limit (%)
                      </label>
                      <input
                        id="risk"
                        type="number"
                        value={risk}
                        onChange={(e) => setRisk(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full bg-void-900 border border-line/50 px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-hi focus:outline-none focus:border-aether-500/50 transition-colors"
                        aria-invalid={!!errors.risk}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="max-per-tx"
                        className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider block mb-2"
                      >
                        Max Per Transaction (SOL)
                      </label>
                      <input
                        id="max-per-tx"
                        type="number"
                        value={maxPerTx}
                        onChange={(e) => setMaxPerTx(e.target.value)}
                        min="0"
                        step="0.1"
                        className="w-full bg-void-900 border border-line/50 px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-hi focus:outline-none focus:border-aether-500/50 transition-colors"
                        aria-invalid={!!errors.maxPerTx}
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
                  <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid mb-4">
                    Energy required to awaken this Numen
                  </p>
                  <div
                    className="w-full h-2 bg-void-900 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={78}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Energy remaining"
                  >
                    <div className="h-full w-3/4 bg-gradient-to-r from-aether-500 to-gold-500 rounded-full" />
                  </div>
                  <p className="font-[family-name:var(--font-mono)] text-xs text-text-low mt-2">
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
                  {[
                    { label: "Name", value: name || "Unnamed" },
                    { label: "Purpose", value: purpose || "Not set" },
                    { label: "Strategy", value: strategy || "Not set" },
                    { label: "Budget", value: `${budget} SOL` },
                    { label: "Risk", value: `${risk}%` },
                    { label: "Max/Tx", value: `${maxPerTx} SOL` },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-2 border-b border-line/30"
                    >
                      <span className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider">
                        {item.label}
                      </span>
                      <span className="font-[family-name:var(--font-mono)] text-xs text-text-hi capitalize">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {errors.submit && (
                  <p className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-xs text-danger mb-4">
                    <Warning size={12} /> {errors.submit}
                  </p>
                )}

                <div className="text-center">
                  <p className="font-[family-name:var(--font-mono)] text-xs text-text-low mb-4">
                    Signing will create a program account, mint your Sigil NFT,
                    and store config on-chain.
                  </p>
                  <button
                    onClick={handleSeal}
                    disabled={isSubmitting}
                    className="px-10 py-4 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-300 transition-all focus-ritual glow-gold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sealing..." : "Seal the Binding"}
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
              className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-xs text-text-mid hover:text-text-hi transition-colors focus-ritual disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={12} /> Back
            </button>
            {step < 5 && (
              <button
                onClick={nextStep}
                className="flex items-center gap-1 px-6 py-2 border border-aether-500/30 text-aether-500 font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase hover:bg-aether-500/10 transition-all focus-ritual"
              >
                Continue <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
