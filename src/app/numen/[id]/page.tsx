"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Warning } from "@phosphor-icons/react";
import { SigilAvatar } from "@/components/SigilAvatar";
import { AetherMeter } from "@/components/AetherMeter";
import { LogStream, type LogAction } from "@/components/LogStream";
import { FocusTrap } from "@/components/FocusTrap";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getNumen, getActions, setNumenStatus, type Numen as DbNumen } from "@/lib/db";

const TABS = ["Overview", "Strategy", "Activity", "Performance"];

const MOCK_NUMEN: DbNumen = {
  id: "n1",
  owner: "11111111111111111111111111111111",
  name: "AEGIS",
  strategy: "Momentum Hunter",
  status: "awake",
  budget_lamports: 5_000_000_000_000,
  max_per_tx: 200_000_000_000,
  spent: 1_247_830_000_000,
  pnl: 1247.83,
  on_chain_id: null,
  created_at: new Date().toISOString(),
};

export default function NumenDetailPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop() ?? "";
  const [activeTab, setActiveTab] = useState("Overview");
  const [showSilenceConfirm, setShowSilenceConfirm] = useState(false);

  const { data: numen, loading } = useSupabaseQuery<DbNumen>(
    () => getNumen(id),
    MOCK_NUMEN,
    [id]
  );

  const { data: actions } = useSupabaseQuery<LogAction[]>(
    () => getActions(id, 20),
    [],
    [id]
  );

  const handleToggleStatus = async () => {
    if (!numen) return;
    const newStatus = numen.status === "awake" ? "silence" : "awake";
    try {
      await setNumenStatus(numen.id, newStatus);
    } catch (err) {
      console.error("[numen]", err);
    }
    setShowSilenceConfirm(false);
  };

  if (loading) {
    return (
      <main className="min-h-[100dvh] pt-24 pb-20 px-4 md:px-8 flex items-center justify-center">
        <p className="font-[family-name:var(--font-mono)] text-xs text-text-low animate-pulse">
          Awakening...
        </p>
      </main>
    );
  }

  if (!numen) {
    return (
      <main className="min-h-[100dvh] pt-24 pb-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-[family-name:var(--font-display)] text-lg text-text-mid">
            Numen not found.
          </p>
          <Link href="/sanctum" className="inline-flex items-center gap-2 mt-4 text-aether-500 font-[family-name:var(--font-mono)] text-xs focus-ritual">
            <ArrowLeft size={12} /> Back to Sanctum
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/sanctum"
          className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-xs text-text-low hover:text-aether-500 transition-colors focus-ritual tracking-wider uppercase mb-8"
        >
          <ArrowLeft size={12} /> Back to Sanctum
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
          <div className={numen.status === "awake" ? "sigil-rotate" : ""}>
            <SigilAvatar seed={numen.name} size={96} label={`${numen.name} sigil`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-wider text-text-hi">
                {numen.name}
              </h1>
              <span
                className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider px-2 py-0.5 border ${
                  numen.status === "awake"
                    ? "border-success/30 text-success"
                    : "border-line/50 text-text-low"
                }`}
              >
                {numen.status}
              </span>
            </div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider">
              {numen.strategy} agent
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSilenceConfirm(true)}
              className="px-4 py-2 border border-aether-500/30 text-aether-500 font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase hover:bg-aether-500/10 transition-all focus-ritual"
            >
              {numen.status === "awake" ? "Silence" : "Awaken"}
            </button>
          </div>
        </div>

        {/* Silence confirmation dialog */}
        <FocusTrap
          open={showSilenceConfirm}
          onClose={() => setShowSilenceConfirm(false)}
          title="Confirm silence"
        >
          <div className="border border-line/50 bg-surface-700 p-6 max-w-sm mx-4">
            <div className="flex items-center gap-2 mb-4">
              <Warning size={20} className="text-warning" />
              <h3 className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi">
                Silence this Numen?
              </h3>
            </div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid mb-6">
              This will pause all autonomous actions. You can awaken it again
              at any time.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSilenceConfirm(false)}
                className="flex-1 px-4 py-2 border border-line/50 text-text-mid font-[family-name:var(--font-mono)] text-xs uppercase hover:text-text-hi transition-colors focus-ritual"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleStatus}
                className="flex-1 px-4 py-2 bg-danger/20 border border-danger/30 text-danger font-[family-name:var(--font-mono)] text-xs uppercase hover:bg-danger/30 transition-colors focus-ritual"
              >
                Silence
              </button>
            </div>
          </div>
        </FocusTrap>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-line/50 mb-8 overflow-x-auto" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`panel-${tab.toLowerCase()}`}
              className={`px-4 py-3 font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "text-gold-500 border-b-2 border-gold-500"
                  : "text-text-low hover:text-text-mid"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "Overview" && (
          <motion.div
            id="panel-overview"
            role="tabpanel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "PnL",
                  value: `${numen.pnl >= 0 ? "+" : ""}${numen.pnl.toFixed(2)} SOL`,
                  color: numen.pnl >= 0 ? "text-plasma-400" : "text-danger",
                },
                { label: "Spent", value: `${(numen.spent / 1_000_000_000).toFixed(2)} SOL`, color: "text-text-hi" },
                { label: "Budget", value: `${(numen.budget_lamports / 1_000_000_000).toFixed(0)} SOL`, color: "text-text-hi" },
                { label: "Status", value: numen.status, color: numen.status === "awake" ? "text-success" : "text-text-low" },
              ].map((stat) => (
                <div key={stat.label} className="border border-line/50 bg-surface-700 p-4">
                  <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mb-2">
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

        {activeTab === "Strategy" && (
          <motion.div
            id="panel-strategy"
            role="tabpanel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-line/50 bg-surface-700 p-6"
          >
            <h3 className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi mb-4">
              Strategy
            </h3>
            <div className="bg-void-900 border border-line/30 p-4 font-[family-name:var(--font-mono)] text-xs text-plasma-400 leading-relaxed">
              {numen.strategy}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-line/30">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mb-1">
                  Budget
                </p>
                <p className="font-[family-name:var(--font-mono)] text-sm text-text-hi">
                  {(numen.budget_lamports / 1_000_000_000).toFixed(0)} SOL
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mb-1">
                  Max/Tx
                </p>
                <p className="font-[family-name:var(--font-mono)] text-sm text-text-hi">
                  {(numen.max_per_tx / 1_000_000_000).toFixed(0)} SOL
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mb-1">
                  Spent
                </p>
                <p className="font-[family-name:var(--font-mono)] text-sm text-text-hi">
                  {(numen.spent / 1_000_000_000).toFixed(2)} SOL
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "Activity" && (
          <motion.div
            id="panel-activity"
            role="tabpanel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-line/50 bg-surface-700 p-4"
          >
            <LogStream numenId={numen.id} initialActions={actions} />
          </motion.div>
        )}

        {activeTab === "Performance" && (
          <motion.div
            id="panel-performance"
            role="tabpanel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-line/50 bg-surface-700 p-8"
          >
            <div className="h-48 flex items-center justify-center border border-line/30 bg-void-900 mb-6">
              <p className="font-[family-name:var(--font-mono)] text-xs text-text-low">
                Equity curve chart (connect Supabase for live data)
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Trades", value: actions.filter((a) => a.kind === "trade").length.toLocaleString() },
                { label: "Alerts", value: actions.filter((a) => a.kind === "alert").length.toLocaleString() },
                { label: "Heartbeats", value: actions.filter((a) => a.kind === "heartbeat").length.toLocaleString() },
                { label: "Actions", value: actions.length.toLocaleString() },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mb-1">
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
