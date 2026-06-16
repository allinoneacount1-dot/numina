/**
 * NÚMINA Agent Loop — Supabase Edge Function
 *
 * Runs on pg_cron schedule (every 2min).
 * For each awake Numen:
 *   1. Fetch market data (Jupiter/Pyth)
 *   2. Send config + market data to LLM (Groq free tier)
 *   3. If LLM returns action within bounds → build tx → send
 *   4. Log result to actions table
 *
 * Deploy: supabase functions deploy agent-loop
 * Schedule: select cron.schedule('agent-loop', '*/2 * * * *', $$SELECT net.http_post(...)$$);
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const JUPITER_PRICE_URL = "https://api.jup.ag/price/v2";

/* ------------------------------------------------------------------ */
/*  Zod-like runtime validation (no Zod dependency in Edge Functions) */
/* ------------------------------------------------------------------ */

interface ValidationResult {
  valid: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

function validateAction(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { valid: false, error: "Not an object" };
  }
  const obj = input as Record<string, unknown>;

  // Validate action field
  if (obj.action !== null && obj.action !== undefined) {
    if (typeof obj.action !== "object") {
      return { valid: false, error: "action is not an object" };
    }
    const action = obj.action as Record<string, unknown>;
    const validTypes = ["trade", "alert", "heartbeat"];
    if (!validTypes.includes(action.type as string)) {
      return { valid: false, error: `Invalid action type: ${action.type}` };
    }
    if (action.type === "trade") {
      if (typeof action.amountLamports !== "number" || action.amountLamports < 0) {
        return { valid: false, error: "Invalid amountLamports" };
      }
    }
  }

  // Validate reasoning
  if (typeof obj.reasoning !== "string" || obj.reasoning.length > 1000) {
    return { valid: false, error: "Invalid reasoning" };
  }

  return { valid: true, data: obj };
}

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface NumenRow {
  id: string;
  owner: string;
  name: string;
  strategy: string;
  status: string;
  budget_lamports: number;
  max_per_tx: number;
  spent: number;
}

/* ------------------------------------------------------------------ */
/*  Main handler                                                      */
/* ------------------------------------------------------------------ */

serve(async (req) => {
  // Verify cron secret
  const authHeader = req.headers.get("Authorization");
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: "Missing Supabase config" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Fetch all awake numina
  const { data: numina, error: fetchError } = await supabase
    .from("numina")
    .select("*")
    .eq("status", "awake");

  if (fetchError || !numina || numina.length === 0) {
    return new Response(
      JSON.stringify({ processed: 0, error: fetchError?.message }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  let processed = 0;
  let errors = 0;

  // 2. Process each numen
  for (const numen of numina as NumenRow[]) {
    try {
      const prices = await fetchPrices(numen.strategy);
      const prompt = buildPrompt(numen, prices);
      const decision = await callLLM(prompt);

      if (decision && decision.action) {
        // Validate action schema
        const validation = validateAction(decision);
        if (!validation.valid) {
          await logAction(supabase, numen.id, "alert", {
            message: `Invalid LLM response: ${validation.error}`,
          });
          errors++;
          continue;
        }

        // Validate against budget guards
        if (decision.action.type === "trade") {
          const costLamports = decision.action.amountLamports ?? 0;
          if (costLamports > numen.max_per_tx) {
            await logAction(supabase, numen.id, "alert", {
              message: `Rejected: exceeds max_per_tx`,
            });
            errors++;
            continue;
          }
          if (numen.spent + costLamports > numen.budget_lamports) {
            await logAction(supabase, numen.id, "alert", {
              message: `Rejected: exceeds remaining budget`,
            });
            errors++;
            continue;
          }
        }

        await logAction(supabase, numen.id, decision.action.type, {
          type: decision.action.type,
          details: decision.action.details ?? null,
          amountLamports: decision.action.amountLamports ?? null,
          reasoning: decision.reasoning,
        });

        if (decision.action.type === "trade" && decision.action.amountLamports) {
          await supabase
            .from("numina")
            .update({ spent: numen.spent + decision.action.amountLamports })
            .eq("id", numen.id);
        }

        processed++;
      } else {
        await logAction(supabase, numen.id, "heartbeat", {
          message: "No action required",
        });
        processed++;
      }
    } catch (err) {
      console.error(`[agent-loop] Error processing ${numen.name}:`, err);
      await logAction(supabase, numen.id, "alert", {
        message: `Error: ${err instanceof Error ? err.message : "unknown"}`,
      });
      errors++;
    }
  }

  return new Response(
    JSON.stringify({ processed, errors, total: numina.length }),
    { headers: { "Content-Type": "application/json" } }
  );
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

async function fetchPrices(_strategy: string): Promise<Record<string, number>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const resp = await fetch(JUPITER_PRICE_URL, { signal: controller.signal });
    clearTimeout(timeout);
    const data = await resp.json();
    return { SOL: data.data?.So11111111111111111111111111111111111111112?.price ?? 0 };
  } catch {
    return { SOL: 0 };
  }
}

function buildPrompt(numen: NumenRow, prices: Record<string, number>): string {
  return `You are an autonomous trading agent named "${numen.name}".
Strategy: ${numen.strategy}
Budget remaining: ${(numen.budget_lamports - numen.spent) / 1e9} SOL
Max per transaction: ${numen.max_per_tx / 1e9} SOL

Current market prices:
${Object.entries(prices).map(([k, v]) => `${k}: $${v}`).join("\n")}

Decide: should we take action? Respond with JSON:
{
  "action": { "type": "trade|alert|heartbeat", "details": "...", "amountLamports": 0 },
  "reasoning": "..."
}
If no action needed, set action to null.`;
}

async function callLLM(prompt: string): Promise<{
  action: { type: string; details: string; amountLamports?: number } | null;
  reasoning: string;
} | null> {
  const apiKey = Deno.env.get("GROQ_API_KEY");
  if (!apiKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const resp = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 512,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

async function logAction(
  supabase: ReturnType<typeof createClient>,
  numenId: string,
  kind: string,
  detail: Record<string, unknown>
) {
  await supabase.from("actions").insert({
    numen_id: numenId,
    kind,
    detail,
  });
}
