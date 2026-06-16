"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Warning, Diamond, Circle } from "@phosphor-icons/react";
import { getSupabase } from "@/lib/supabase";

export interface LogAction {
  id: string;
  numen_id: string;
  kind: string;
  detail: Record<string, unknown>;
  result: string | null;
  created_at: string;
}

interface Props {
  numenId?: string;
  initialActions?: LogAction[];
}

const kindConfig: Record<string, { Icon: typeof Diamond; color: string }> = {
  trade: { Icon: Diamond, color: "text-plasma-400" },
  alert: { Icon: Warning, color: "text-warning" },
  decision: { Icon: Circle, color: "text-aether-500" },
  heartbeat: { Icon: Circle, color: "text-text-low" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function LogStream({ numenId, initialActions = [] }: Props) {
  const [actions, setActions] = useState<LogAction[]>(initialActions);

  const handleInsert = useCallback(
    (payload: { new: LogAction }) => {
      if (numenId && payload.new.numen_id !== numenId) return;
      setActions((prev) => [payload.new, ...prev].slice(0, 50));
    },
    [numenId]
  );

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel("actions-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "actions" },
        handleInsert
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [handleInsert]);

  return (
    <div className="space-y-2" role="log" aria-label="Activity log" aria-live="polite">
      <AnimatePresence initial={false}>
        {actions.length === 0 ? (
          <p className="font-[family-name:var(--font-mono)] text-xs text-text-low py-8 text-center">
            No activity yet.
          </p>
        ) : (
          actions.map((action) => {
            const { Icon, color } =
              kindConfig[action.kind] || kindConfig.decision;
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -10, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 py-2 border-b border-line/20 last:border-0"
              >
                <span className={`mt-0.5 ${color}`} aria-hidden="true">
                  <Icon size={14} weight="fill" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-[family-name:var(--font-mono)] text-xs text-text-hi truncate">
                    {action.result || action.kind}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-[family-name:var(--font-mono)] text-xs text-text-low">
                      {timeAgo(action.created_at)}
                    </span>
                    {action.detail && "txSig" in action.detail && (
                      <span className="font-[family-name:var(--font-mono)] text-xs text-aether-500">
                        {String(action.detail.txSig)}
                      </span>
                    )}
                    {action.detail && "pnl" in action.detail && (
                      <span
                        className={`font-[family-name:var(--font-mono)] text-xs ${
                          Number(action.detail.pnl) >= 0
                            ? "text-plasma-400"
                            : "text-danger"
                        }`}
                      >
                        {Number(action.detail.pnl) >= 0 ? "+" : ""}
                        {String(action.detail.pnl)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
}
