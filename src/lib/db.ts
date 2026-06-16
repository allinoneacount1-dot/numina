import { requireSupabase } from "./supabase";

/* ------------------------------------------------------------------ */
/*  Input validation helpers                                          */
/* ------------------------------------------------------------------ */

const SOLANA_ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function validateWallet(wallet: string): void {
  if (!SOLANA_ADDRESS_RE.test(wallet)) {
    throw new Error(`Invalid Solana wallet address: ${wallet}`);
  }
}

function validateId(id: string): void {
  if (!id || typeof id !== "string" || id.length > 128) {
    throw new Error(`Invalid ID: ${id}`);
  }
}

function validateNumenInput(
  numen: Omit<Numen, "id" | "created_at" | "spent" | "pnl">
): void {
  validateWallet(numen.owner);
  if (!numen.name || numen.name.length > 64) {
    throw new Error("Name is required (max 64 chars)");
  }
  if (!numen.strategy || numen.strategy.length > 128) {
    throw new Error("Strategy is required (max 128 chars)");
  }
  if (numen.budget_lamports < 0) throw new Error("Budget must be non-negative");
  if (numen.max_per_tx < 0) throw new Error("Max per tx must be non-negative");
  if (numen.max_per_tx > numen.budget_lamports) {
    throw new Error("Max per tx cannot exceed budget");
  }
}

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface Profile {
  wallet: string;
  nonce: string | null;
  created_at: string;
}

export interface Numen {
  id: string;
  owner: string;
  name: string;
  strategy: string;
  status: "awake" | "silence";
  budget_lamports: number;
  max_per_tx: number;
  spent: number;
  pnl: number;
  on_chain_id: string | null;
  created_at: string;
}

export interface Action {
  id: string;
  numen_id: string;
  kind: string;
  detail: Record<string, unknown>;
  result: string | null;
  created_at: string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string | null;
  author: string | null;
  is_public: boolean;
  risk_level: "low" | "medium" | "high";
  config: Record<string, unknown>;
  clones: number;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Queries                                                           */
/* ------------------------------------------------------------------ */

export async function upsertProfile(wallet: string) {
  validateWallet(wallet);
  const { data, error } = await requireSupabase()
    .from("profiles")
    .upsert({ wallet }, { onConflict: "wallet" })
    .select()
    .single();

  if (error) throw new Error(`Failed to upsert profile: ${error.message}`);
  return data as Profile;
}

export async function getNumina(owner: string) {
  validateWallet(owner);
  const { data, error } = await requireSupabase()
    .from("numina")
    .select("*")
    .eq("owner", owner)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch numina: ${error.message}`);
  return data as Numen[];
}

export async function getNumen(id: string) {
  validateId(id);
  const { data, error } = await requireSupabase()
    .from("numina")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Failed to fetch numen: ${error.message}`);
  return data as Numen;
}

export async function createNumen(
  numen: Omit<Numen, "id" | "created_at" | "spent" | "pnl">
) {
  validateNumenInput(numen);
  const { data, error } = await requireSupabase()
    .from("numina")
    .insert(numen)
    .select()
    .single();

  if (error) throw new Error(`Failed to create numen: ${error.message}`);
  return data as Numen;
}

export async function setNumenStatus(
  id: string,
  status: "awake" | "silence"
) {
  validateId(id);
  const { data, error } = await requireSupabase()
    .from("numina")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update status: ${error.message}`);
  return data as Numen;
}

export async function getActions(numenId: string, limit = 50) {
  validateId(numenId);
  const { data, error } = await requireSupabase()
    .from("actions")
    .select("*")
    .eq("numen_id", numenId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch actions: ${error.message}`);
  return data as Action[];
}

export async function insertAction(
  action: Omit<Action, "id" | "created_at">
) {
  validateId(action.numen_id);
  if (!action.kind || action.kind.length > 32) {
    throw new Error("Invalid action kind");
  }
  const { data, error } = await requireSupabase()
    .from("actions")
    .insert(action)
    .select()
    .single();

  if (error) throw new Error(`Failed to insert action: ${error.message}`);
  return data as Action;
}

export async function getStrategies() {
  const { data, error } = await requireSupabase()
    .from("strategies")
    .select("*")
    .eq("is_public", true)
    .order("clones", { ascending: false });

  if (error) throw new Error(`Failed to fetch strategies: ${error.message}`);
  return data as Strategy[];
}

export async function getLeaderboard(limit = 20) {
  const { data, error } = await requireSupabase()
    .from("numina")
    .select("id, name, strategy, status, pnl, spent, owner")
    .order("pnl", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch leaderboard: ${error.message}`);

  // Single query for action counts using RPC or inline aggregate
  // Fallback: fetch counts in parallel (not sequentially)
  const ids = data.map((n) => n.id);
  const actionCountsPromise = ids.length > 0
    ? requireSupabase()
        .from("actions")
        .select("numen_id")
        .in("numen_id", ids)
    : Promise.resolve({ data: [] as { numen_id: string }[] });

  const { data: actionCounts } = await actionCountsPromise;

  const counts = new Map<string, number>();
  actionCounts?.forEach((a) => counts.set(a.numen_id, (counts.get(a.numen_id) ?? 0) + 1));

  return data.map((n, i) => ({
    ...n,
    rank: i + 1,
    followers: 0,
    actions: counts.get(n.id) ?? 0,
  }));
}

export type LeaderboardRow = Awaited<ReturnType<typeof getLeaderboard>>[number];
