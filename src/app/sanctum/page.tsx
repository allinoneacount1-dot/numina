"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Lightning, Plus } from "@phosphor-icons/react";
import { NumenCard } from "@/components/NumenCard";
import { AetherMeter } from "@/components/AetherMeter";
import { LogStream } from "@/components/LogStream";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getNumina, type Numen as DbNumen } from "@/lib/db";

const MOCK_NUMINA: DbNumen[] = [
  {
    id: "n1", owner: "11111111111111111111111111111111", name: "AEGIS", strategy: "Momentum Hunter",
    status: "awake", budget_lamports: 5_000_000_000_000, max_per_tx: 200_000_000_000,
    spent: 1_247_830_000_000, pnl: 1247.83, on_chain_id: null, created_at: new Date().toISOString(),
  },
  {
    id: "n2", owner: "11111111111111111111111111111111", name: "ORACLE", strategy: "Sentinel",
    status: "awake", budget_lamports: 0, max_per_tx: 0,
    spent: 0, pnl: 0, on_chain_id: null, created_at: new Date().toISOString(),
  },
];

export default function SanctumPage() {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [filter, setFilter] = useState<"all" | "awake" | "silence">("all");

  const wallet = publicKey?.toBase58() ?? null;

  const { data: allNumina, loading, error } = useSupabaseQuery<DbNumen[]>(
    () => (wallet ? getNumina(wallet) : Promise.resolve([])),
    MOCK_NUMINA,
    [wallet]
  );

  const filteredNumina = useMemo(
    () =>
      filter === "all"
        ? allNumina
        : allNumina.filter((n) => n.status === filter),
    [filter, allNumina]
  );

  if (!publicKey) {
    return (
      <main className="min-h-[100dvh] pt-24 pb-20 px-4 md:px-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-text-hi mb-4">
            The Sanctum
          </h1>
          <p className="font-[family-name:var(--font-body)] text-sm text-text-mid mb-8">
            Connect your wallet to enter the inner sanctum.
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

  return (
    <main className="min-h-[100dvh] pt-24 pb-20 px-4 md:px-8">
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-300 transition-all focus-ritual glow-gold"
            >
              <Plus size={14} weight="bold" />
              Begin the Rite
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6" role="group" aria-label="Filter Numina by status">
          {(["all", "awake", "silence"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase transition-all ${
                filter === f
                  ? "bg-aether-500 text-void-900"
                  : "border border-line/50 text-text-mid hover:border-aether-500/30 hover:text-text-hi"
              }`}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </div>

        {error && (
          <div className="border border-danger/30 bg-danger/5 p-4 mb-6">
            <p className="font-[family-name:var(--font-mono)] text-xs text-danger">
              Connection error: {error.message}. Showing cached data.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Numen grid */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="border border-line/50 bg-surface-700 p-12 text-center">
                <p className="font-[family-name:var(--font-mono)] text-xs text-text-low animate-pulse">
                  Awakening...
                </p>
              </div>
            ) : filteredNumina.length === 0 ? (
              <div className="border border-line/50 bg-surface-700 p-12 text-center">
                <p className="font-[family-name:var(--font-display)] text-lg text-text-mid mb-4">
                  No Numina answer yet.
                </p>
                <p className="font-[family-name:var(--font-mono)] text-xs text-text-low mb-6">
                  Light the first. Begin the Rite to summon your first Numen.
                </p>
                <Link
                  href="/sanctum/invoke"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-300 transition-all focus-ritual"
                >
                  <Plus size={14} weight="bold" />
                  Begin the Rite
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNumina.map((numen, i) => (
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
                <h3 className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider">
                  Activity Log
                </h3>
                <span
                  className="w-2 h-2 rounded-full bg-success animate-pulse"
                  aria-label="Live"
                />
              </div>
              <LogStream />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
