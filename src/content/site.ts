export const site = {
  name: "NUMINA",
  tagline: "Summon intelligence. Bind it to the chain.",
  url: "https://numina.fun",
  nav: [
    { label: "The Gate", href: "/" },
    { label: "Sanctum", href: "/sanctum" },
    { label: "Pantheon", href: "/pantheon" },
    { label: "Choir", href: "/choir" },
    { label: "Aether", href: "/aether" },
    { label: "Mythos", href: "/lore" },
  ],
  social: [
    { label: "GitHub", href: "https://github.com/numina" },
    { label: "Discord", href: "https://discord.gg/numina" },
    { label: "Twitter", href: "https://twitter.com/numina" },
  ],
};

export interface Numen {
  id: string;
  name: string;
  sigilSeed: string;
  purpose: "trading" | "monitor" | "task";
  status: "awake" | "silence" | "failed";
  pnl: number;
  winRate: number;
  actions: number;
  uptime: string;
  lastAction: string;
  config: {
    budget: number;
    risk: number;
    maxPerTx: number;
    rules: string;
  };
}

export interface Strategy {
  id: string;
  title: string;
  description: string;
  author: string;
  riskLevel: "conservative" | "moderate" | "aggressive";
  roi: number;
  clones: number;
  asset: string;
  rules: string;
}

export interface ChoirRow {
  rank: number;
  name: string;
  pnl: number;
  followers: number;
  status: "awake" | "silence";
  actions: number;
}

export interface Action {
  id: number;
  numenId: string;
  kind: "decision" | "trade" | "alert";
  payload: string;
  txSig?: string;
  pnl?: number;
  createdAt: string;
}

export const mockNumina: Numen[] = [
  {
    id: "n1",
    name: "AEGIS",
    sigilSeed: "aegis-001",
    purpose: "trading",
    status: "awake",
    pnl: 1247.83,
    winRate: 67.2,
    actions: 1842,
    uptime: "99.7%",
    lastAction: "2 min ago",
    config: { budget: 5000, risk: 15, maxPerTx: 200, rules: "Momentum breakout on SOL/USDC, RSI < 30 buy, RSI > 70 sell" },
  },
  {
    id: "n2",
    name: "ORACLE",
    sigilSeed: "oracle-002",
    purpose: "monitor",
    status: "awake",
    pnl: 0,
    winRate: 0,
    actions: 5621,
    uptime: "100%",
    lastAction: "just now",
    config: { budget: 0, risk: 0, maxPerTx: 0, rules: "Monitor whale wallets, alert on large transfers > 10k SOL" },
  },
  {
    id: "n3",
    name: "WRAITH",
    sigilSeed: "wraith-003",
    purpose: "trading",
    status: "silence",
    pnl: -312.45,
    winRate: 42.1,
    actions: 891,
    uptime: "87.3%",
    lastAction: "3 hours ago",
    config: { budget: 2000, risk: 25, maxPerTx: 100, rules: "Mean reversion on BONK, Z-score > 2 sell, Z-score < -2 buy" },
  },
  {
    id: "n4",
    name: "CIPHER",
    sigilSeed: "cipher-004",
    purpose: "task",
    status: "awake",
    pnl: 0,
    winRate: 0,
    actions: 312,
    uptime: "98.1%",
    lastAction: "15 min ago",
    config: { budget: 100, risk: 5, maxPerTx: 10, rules: "Auto-compound staking rewards, rebalance weekly" },
  },
];

export const mockStrategies: Strategy[] = [
  { id: "s1", title: "Momentum Hunter", description: "Rides breakout trends on major Solana pairs. Uses EMA crossover + volume confirmation.", author: "0xdead...beef", riskLevel: "moderate", roi: 34.2, clones: 127, asset: "SOL/USDC", rules: "EMA 9/21 crossover, volume > 2x avg, RSI filter" },
  { id: "s2", title: "Whale Shadow", description: "Tracks top 50 Solana wallets. Copies trades with 15-minute delay and size scaling.", author: "0xface...cafe", riskLevel: "aggressive", roi: 67.8, clones: 89, asset: "Multi-asset", rules: "Copy top whale wallets, 15min delay, 0.1x size scaling" },
  { id: "s3", title: "Stable Compounder", description: "Low-risk auto-compounding across Solana DeFi. Optimizes yield across lending protocols.", author: "0xbabe...dead", riskLevel: "conservative", roi: 12.4, clones: 234, asset: "USDC", rules: "Auto-compound across Marinade, Jito, Save. Rebalance daily." },
  { id: "s4", title: "Memecoin Radar", description: "Scans new Solana token launches. Buys within 60s of launch if criteria met.", author: "0xc0de...food", riskLevel: "aggressive", roi: 142.6, clones: 56, asset: "SOL pair", rules: "New token < 60s, liquidity > $50k, dev < 5% supply, no mint" },
  { id: "s5", title: "Grid Dancer", description: "Grid trading on high-volume pairs. Profits from sideways chop with tight ranges.", author: "0xface:babe", riskLevel: "moderate", roi: 22.1, clones: 178, asset: "SOL/USDC", rules: "20-grid setup, 0.5% spacing, auto-adjust with ATR" },
  { id: "s6", title: "Sentinel", description: "Pure monitoring agent. Alerts on unusual on-chain activity, price spikes, and governance proposals.", author: "0xabad:babe", riskLevel: "conservative", roi: 0, clones: 312, asset: "All", rules: "Monitor whale tx, price alerts, governance votes, exploit detection" },
];

export const mockChoir: ChoirRow[] = [
  { rank: 1, name: "AEGIS", pnl: 1247.83, followers: 342, status: "awake", actions: 1842 },
  { rank: 2, name: "PHANTOM", pnl: 982.10, followers: 287, status: "awake", actions: 2103 },
  { rank: 3, name: "ECHO", pnl: 876.44, followers: 198, status: "awake", actions: 1567 },
  { rank: 4, name: "CIPHER", pnl: 654.32, followers: 156, status: "awake", actions: 312 },
  { rank: 5, name: "ORACLE", pnl: 0, followers: 445, status: "awake", actions: 5621 },
  { rank: 6, name: "WRAITH", pnl: -312.45, followers: 89, status: "silence", actions: 891 },
  { rank: 7, name: "VIGIL", pnl: 423.67, followers: 134, status: "awake", actions: 934 },
  { rank: 8, name: "SHADE", pnl: 287.91, followers: 98, status: "silence", actions: 678 },
];

export const mockActions: Action[] = [
  { id: 1, numenId: "n1", kind: "trade", payload: "BUY 2.5 SOL @ $142.32", txSig: "5KJG...8mNx", pnl: 12.45, createdAt: "2 min ago" },
  { id: 2, numenId: "n2", kind: "alert", payload: "Whale 0xabc moved 15,000 SOL to Binance", createdAt: "5 min ago" },
  { id: 3, numenId: "n1", kind: "decision", payload: "RSI oversold detected, initiating DCA", createdAt: "12 min ago" },
  { id: 4, numenId: "n4", kind: "trade", payload: "Compound 0.8 SOL from Marinade rewards", txSig: "7HJK...2pQr", createdAt: "15 min ago" },
  { id: 5, numenId: "n1", kind: "trade", payload: "SELL 1.2 SOL @ $144.87", txSig: "3RTY...9wZx", pnl: 8.22, createdAt: "28 min ago" },
  { id: 6, numenId: "n2", kind: "alert", payload: "New token launch detected: $MYTH on Raydium", createdAt: "31 min ago" },
];
