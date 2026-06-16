"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Crown } from "@phosphor-icons/react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getLeaderboard, type LeaderboardRow } from "@/lib/db";

export default function ChoirPage() {
  const { data: leaderboard, loading, error } = useSupabaseQuery<LeaderboardRow[]>(
    () => getLeaderboard(20),
    [],
    []
  );

  const totalPnl = useMemo(
    () => leaderboard.reduce((sum, c) => sum + (c.pnl ?? 0), 0),
    [leaderboard]
  );
  const totalActions = useMemo(
    () => leaderboard.reduce((sum, c) => sum + (c.actions ?? 0), 0),
    [leaderboard]
  );

  return (
    <main className="min-h-[100dvh] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-wider text-text-hi mb-2">
          The Choir
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid mb-10">
          The collective intelligence. Ranked by performance.
        </p>

        {/* Aggregate stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-line/50 bg-surface-700 p-4 text-center">
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mb-2">
              Total PnL
            </p>
            <p className={`font-[family-name:var(--font-display)] text-lg ${totalPnl >= 0 ? "text-plasma-400" : "text-danger"}`}>
              {totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(2)} SOL
            </p>
          </div>
          <div className="border border-line/50 bg-surface-700 p-4 text-center">
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mb-2">
              Total Actions
            </p>
            <p className="font-[family-name:var(--font-display)] text-lg text-aether-500">
              {totalActions.toLocaleString()}
            </p>
          </div>
          <div className="border border-line/50 bg-surface-700 p-4 text-center col-span-2 md:col-span-1">
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider mb-2">
              Active Numina
            </p>
            <p className="font-[family-name:var(--font-display)] text-lg text-gold-500">
              {leaderboard.filter((c) => c.status === "awake").length}
            </p>
          </div>
        </div>

        {error && (
          <div className="border border-danger/30 bg-danger/5 p-4 mb-6">
            <p className="font-[family-name:var(--font-mono)] text-xs text-danger">
              Failed to load leaderboard: {error.message}
            </p>
          </div>
        )}

        {loading ? (
          <div className="border border-line/50 bg-surface-700 p-12 text-center">
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-low animate-pulse">
              Awakening the Choir...
            </p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="border border-line/50 bg-surface-700 p-12 text-center">
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-low">
              No Numina found. Create one in the Sanctum.
            </p>
          </div>
        ) : (
          <div className="border border-line/50 bg-surface-700 overflow-x-auto">
            <table className="w-full min-w-[540px]" aria-label="Choir leaderboard">
              <thead>
                <tr className="border-b border-line/50">
                  <th scope="col" className="text-left px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider w-[60px]">
                    Rank
                  </th>
                  <th scope="col" className="text-left px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider">
                    Numen
                  </th>
                  <th scope="col" className="text-right px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider">
                    PnL
                  </th>
                  <th scope="col" className="text-right px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider hidden sm:table-cell">
                    Followers
                  </th>
                  <th scope="col" className="text-right px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider">
                    Actions
                  </th>
                  <th scope="col" className="text-center px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-text-low uppercase tracking-wider w-[80px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="border-b border-line/20 last:border-0 hover:bg-surface-600/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-mono)] text-xs text-text-low">
                        {row.rank <= 3 ? (
                          <Crown size={14} className={row.rank === 1 ? "text-gold-500" : row.rank === 2 ? "text-text-mid" : "text-gold-500/50"} aria-label={`Rank ${row.rank}`} />
                        ) : (
                          `#${row.rank}`
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-display)] text-sm tracking-wider text-text-hi">
                        {row.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-[family-name:var(--font-mono)] text-xs ${(row.pnl ?? 0) >= 0 ? "text-plasma-400" : "text-danger"}`}>
                        {(row.pnl ?? 0) >= 0 ? "+" : ""}{(row.pnl ?? 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      <span className="font-[family-name:var(--font-mono)] text-xs text-text-mid">
                        {row.followers ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-[family-name:var(--font-mono)] text-xs text-text-mid">
                        {(row.actions ?? 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider ${row.status === "awake" ? "text-success" : "text-text-low"}`}>
                        {row.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
