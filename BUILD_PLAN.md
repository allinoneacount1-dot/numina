# NÚMINA — Full-Stack MVP Build Plan

> Goal: Turn the existing UI shell into a functional full-stack app.
> Current state: 7 pages, 8 components, design system — all client-side, all mock data.
> Target state: Wallet-connected, Supabase-backed, on-chain agent creation, real-time activity.

---

## Phase 1 — Environment & Dependencies

**Goal:** Install all packages, create `.env.example`, set up config.

### Packages to install:
```bash
# Solana
npm install @solana/web3.js @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/spl-token

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Anchor (for IDL types — program itself is Rust/CLI)
npm install @coral-xyz/anchor

# UI additions
npm install @solana/wallet-adapter-react-ui  # styled wallet button
npm install react-hot-toast                   # toast notifications
```

### Files to create:
- `.env.example` — template with all required vars
- `.env.local` — actual keys (gitignored)
- `src/lib/supabase.ts` — Supabase client singleton
- `src/lib/solana.ts` — connection, program ID, helpers
- `src/lib/anchor.ts` — Anchor provider + program interface

### Environment variables needed:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_NUMINA_PROGRAM_ID=
```

---

## Phase 2 — Wallet Connection + Auth

**Goal:** Users can connect Phantom/Solflare, wallet pubkey becomes their identity.

### Changes:
1. **`src/app/layout.tsx`** — Wrap with `WalletAuthProvider`
2. **Create `src/components/WalletProvider.tsx`** — Solana wallet adapter context
3. **Create `src/components/ConnectButton.tsx`** — "Open the gate" CTA, shows address when connected
4. **`src/components/Nav.tsx`** — Replace static wallet icon with ConnectButton
5. **Create `src/lib/auth.ts`** — Sign message to authenticate with Supabase (wallet-based auth)
6. **`src/app/sanctum/page.tsx`** — Gate behind wallet connection, redirect if not connected

### Auth flow:
```
Connect wallet → Sign message("Authenticate to NÚMINA") →
Verify signature server-side → Create/update Supabase profile →
Set session cookie
```

---

## Phase 3 — Supabase Schema + RLS + Client

**Goal:** Database ready, RLS policies active, client typed.

### SQL migrations to run (in Supabase SQL editor):
```sql
-- From blueprint §6.4, plus:
-- - profiles table (wallet → user mapping)
-- - numina table (agent config + on-chain refs)
-- - actions table (log of every decision/trade)
-- - strategies table (public cloneable strategies)
-- - RLS policies: users can only CRUD their own numina/actions
-- - strategies: public read if is_public, owner write
```

### Files to create:
- `src/lib/supabase.ts` — `createClient()` for browser (uses `@supabase/ssr`)
- `src/lib/db.ts` — Typed query helpers: `getNumina(userId)`, `getActions(numenId)`, `getStrategies()`, etc.
- `supabase/migrations/001_initial.sql` — Full schema + RLS (save to repo for version control)

### Key design decisions:
- Wallet pubkey = user identity (no email/password)
- Supabase Auth with custom JWT from wallet signature
- RLS ensures `profiles.wallet = auth.uid()` pattern

---

## Phase 4 — Anchor Program (Solana Smart Contract)

**Goal:** Deploy `numina` program to devnet with PDA creation + guarded execution.

### Program instructions (from blueprint §6.5):
1. `invoke_numen(seed, budget, max_per_tx)` — Create PDA, set authority
2. `set_status(status)` — Awake/silence toggle
3. `execute_action(ix_data)` — Authority-only, checks budget + max_per_tx guardrails
4. `revoke()` — Revoke delegation, return remaining funds

### Files:
- `programs/numina/src/lib.rs` — Anchor program (Rust)
- `programs/numina/src/state.rs` — Numen account struct
- `programs/numina/src/instructions/` — One file per instruction
- `Anchor.toml` — Config for devnet deployment
- `src/lib/anchor.ts` — Frontend: IDL import, Program class, PDA derivation helper

### PDA derivation:
```
seeds = [b"numen", owner_pubkey.as_ref(), seed_bytes.as_ref()]
program_id = NUMINA_PROGRAM_ID
```

### Testing:
- `anchor test` with localnet
- Test invoke → execute → revoke flow
- Test budget guardrail (reject if over budget)

---

## Phase 5 — Wire Frontend to Real Data

**Goal:** Replace all `mockNumina`, `mockStrategies`, etc. with Supabase queries.

### Changes per page:

| Page | Mock data source | Replace with |
|------|-----------------|--------------|
| `/sanctum` | `mockNumina` | `supabase.from('numina').select().eq('owner', wallet)` |
| `/numen/[id]` | `mockNumina[0]` | `supabase.from('numina').select().eq('id', id).single()` |
| `/pantheon` | `mockStrategies` | `supabase.from('strategies').select().eq('is_public', true)` |
| `/choir` | `mockChoir` | `supabase.from('numina').select().order('pnl', {ascending: false})` |
| `/aether` | hardcoded | On-chain $LMN balance via `@solana/web3.js` |
| `/sanctum/invoke` | wizard only | Wizard → submit → `invoke_numen` tx → insert to Supabase |

### Files to create:
- `src/hooks/useNumina.ts` — SWR/React Query hook for user's agents
- `src/hooks/useStrategies.ts` — Hook for public strategies
- `src/hooks/useActions.ts` — Hook for activity log
- `src/hooks/useBalance.ts` — Hook for $LMN balance (on-chain)

### Key pattern:
```typescript
// Example: src/hooks/useNumina.ts
export function useNumina(wallet: string | null) {
  return useSWR(wallet ? ['numina', wallet] : null, async () => {
    const { data } = await supabase.from('numina').select().eq('owner', wallet)
    return data as Numen[]
  })
}
```

---

## Phase 6 — Real-Time LogStream

**Goal:** Activity feed updates live via Supabase Realtime.

### Changes:
1. **`src/components/LogStream.tsx`** — Subscribe to `actions` table inserts
2. **`src/app/sanctum/page.tsx`** — Real-time dashboard updates
3. **`src/app/numen/[id]/page.tsx`** — Per-agent activity stream

### Supabase Realtime setup:
```typescript
supabase
  .channel('actions')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'actions' }, payload => {
    // prepend to log stream
  })
  .subscribe()
```

---

## Phase 7 — Autonomous Loop (Edge Functions)

**Goal:** Agents actually do things on schedule.

### Architecture:
```
pg_cron (every 2min) → Edge Function →
  1. Query numina WHERE status='awake'
  2. For each: fetch price data (Jupiter API) + on-chain signals (Helius)
  3. Send config + market data to LLM (Groq free)
  4. If LLM returns action within bounds → build tx → send via authority
  5. Log result to actions table
  6. Realtime pushes to UI
```

### Files to create:
- `supabase/functions/agent-loop/index.ts` — Main Edge Function
- `supabase/functions/agent-loop/prompts.ts` — LLM prompt templates per strategy type
- `supabase/functions/agent-loop/market.ts` — Jupiter/Pyth price fetching
- `supabase/functions/agent-loop/tx-builder.ts` — Anchor tx construction
- `supabase/migrations/002_cron.sql` — pg_cron job definition

### Security model:
- Agent authority is a PDA (not user's main key)
- `budget_lamports` and `max_per_tx` enforced on-chain
- Large actions require co-signing (future)

---

## Phase 8 — Sigil NFT Minting (Metaplex)

**Goal:** Each agent gets a unique generative NFT as identity.

### Flow:
1. User creates agent → seed = hash(wallet + name)
2. Client renders SVG from seed (deterministic)
3. Upload SVG to IPFS via nft.storage
4. Mint via Metaplex Core program
5. Store `nft_mint` in Supabase `numina` table

### Packages:
```bash
npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi
```

---

## Execution Order

```
Phase 1 (deps) → Phase 2 (wallet) → Phase 3 (supabase) →
Phase 4 (anchor) → Phase 5 (wire data) → Phase 6 (realtime) →
Phase 7 (autonomy) → Phase 8 (NFT)
```

Each phase builds on the previous. Phases 1-3 can be done in ~1 session.
Phase 4 requires Rust/Anchor toolchain. Phase 5-6 are the "it works" moment.
Phase 7-8 are the "it's alive" moment.

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Supabase free tier limits (500MB, 500K rows) | Batch inserts, archive old actions, use pg_cron intervals wisely |
| Edge Function cold start (10s) | Keep functions warm via cron, batch multiple agents per invocation |
| Solana devnet instability | Retry logic, graceful degradation, show "Silence" state |
| LLM rate limits (Groq free) | Queue decisions, prioritize high-budget agents, fallback to rule-based |
| Wallet UX friction | Clear onboarding copy, remember connection, lazy-load wallet adapter |

---

## Verification Checklist

After each phase, verify:
- [ ] `npm run build` passes (no TypeScript errors)
- [ ] `npm run lint` passes
- [ ] Manual test on localhost:3000
- [ ] No secrets committed to git
