import { Connection } from "@solana/web3.js";

export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";

export const NUMINA_PROGRAM_ID =
  process.env.NEXT_PUBLIC_NUMINA_PROGRAM_ID || "";

export function getConnection() {
  return new Connection(SOLANA_RPC_URL, "confirmed");
}
