"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { SigilAvatar } from "./SigilAvatar";
import type { Numen } from "@/lib/db";

interface Props {
  numen: Numen;
}

export function NumenCard({ numen }: Props) {
  const statusColor =
    numen.status === "awake"
      ? "text-success"
      : "text-text-low";
  const statusGlow = numen.status === "awake" ? "glow-aether" : "";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <Link
        href={`/numen/${numen.id}`}
        className={`block border border-line/50 bg-surface-700 p-6 hover:border-aether-500/30 transition-all duration-300 ${statusGlow}`}
      >
        <div className="flex items-start gap-4">
          <div className={numen.status === "awake" ? "sigil-rotate" : ""}>
            <SigilAvatar seed={numen.name} size={48} label={`${numen.name} sigil`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi truncate">
                {numen.name}
              </h3>
              <span
                className={`text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider ${statusColor}`}
              >
                {numen.status}
              </span>
            </div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider">
              {numen.strategy}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-line/30">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mb-1">
              PnL
            </p>
            <p
              className={`font-[family-name:var(--font-mono)] text-sm font-medium ${
                numen.pnl >= 0 ? "text-plasma-400" : "text-danger"
              }`}
            >
              {numen.pnl >= 0 ? "+" : ""}
              {numen.pnl.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mb-1">
              Budget
            </p>
            <p className="font-[family-name:var(--font-mono)] text-sm font-medium text-text-hi">
              {(numen.budget_lamports / 1_000_000_000).toFixed(0)} SOL
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mb-1">
              Spent
            </p>
            <p className="font-[family-name:var(--font-mono)] text-sm font-medium text-text-hi">
              {(numen.spent / 1_000_000_000).toFixed(2)} SOL
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <span className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-xs text-aether-500 tracking-wider uppercase">
            View <ArrowRight size={12} weight="light" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
