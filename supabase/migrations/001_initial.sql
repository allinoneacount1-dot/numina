-- NÚMINA — Initial schema
-- Run this in Supabase SQL Editor

-- ============================================================
-- 1. PROFILES — wallet-linked identity
-- ============================================================
create table if not exists profiles (
  wallet    text primary key,
  nonce     text,
  created_at timestamptz default now()
);

-- ============================================================
-- 2. NUMINA — autonomous agents
-- ============================================================
create table if not exists numina (
  id            uuid primary key default gen_random_uuid(),
  owner         text not null references profiles(wallet),
  name          text not null,
  strategy      text not null,
  status        text not null default 'silence' check (status in ('awake', 'silence')),
  budget_lamports bigint not null default 1000000000,
  max_per_tx    bigint not null default 100000000,
  spent         bigint not null default 0,
  pnl           bigint not null default 0,
  on_chain_id   text,
  created_at    timestamptz default now()
);

create index if not exists idx_numina_owner on numina(owner);
create index if not exists idx_numina_status on numina(status);

-- ============================================================
-- 3. ACTIONS — every decision / trade / heartbeat
-- ============================================================
create table if not exists actions (
  id          uuid primary key default gen_random_uuid(),
  numen_id    uuid not null references numina(id) on delete cascade,
  kind        text not null default 'heartbeat',
  detail      jsonb default '{}',
  result      text,
  created_at  timestamptz default now()
);

create index if not exists idx_actions_numen on actions(numen_id);
create index if not exists idx_actions_created on actions(created_at desc);

-- ============================================================
-- 4. STRATEGIES — public, cloneable templates
-- ============================================================
create table if not exists strategies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  author      text references profiles(wallet),
  is_public   boolean default false,
  risk_level  text default 'medium' check (risk_level in ('low', 'medium', 'high')),
  config      jsonb default '{}',
  clones      int default 0,
  created_at  timestamptz default now()
);

create index if not exists idx_strategies_public on strategies(is_public) where is_public = true;

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table numina enable row level security;
alter table actions enable row level security;
alter table strategies enable row level security;

-- Profiles: users can read/update their own
create policy "profiles_select_own" on profiles
  for select using (wallet = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "profiles_insert_own" on profiles
  for insert with check (wallet = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "profiles_update_own" on profiles
  for update using (wallet = current_setting('request.jwt.claims', true)::json->>'sub');

-- Numina: users can CRUD their own, read all
create policy "numina_select_own" on numina
  for select using (owner = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "numina_insert_own" on numina
  for insert with check (owner = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "numina_update_own" on numina
  for update using (owner = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "numina_delete_own" on numina
  for delete using (owner = current_setting('request.jwt.claims', true)::json->>'sub');

-- Actions: users can read actions for their own numina
create policy "actions_select_own" on actions
  for select using (
    numen_id in (
      select id from numina where owner = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

create policy "actions_insert_own" on actions
  for insert with check (
    numen_id in (
      select id from numina where owner = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- Strategies: public read, owner write
create policy "strategies_select_public" on strategies
  for select using (is_public = true or author = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "strategies_insert_own" on strategies
  for insert with check (author = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "strategies_update_own" on strategies
  for update using (author = current_setting('request.jwt.claims', true)::json->>'sub');
