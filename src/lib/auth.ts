import { requireSupabase } from "./supabase";
import { verify } from "@noble/ed25519";

/**
 * Verify a wallet signature and create/update a Supabase profile.
 *
 * Flow:
 *   1. Client sends wallet address + signed message
 *   2. We reconstruct the expected message and verify the signature
 *   3. If valid, upsert the profile
 */
export async function signInWithWallet(
  wallet: string,
  signature: Uint8Array,
  message: Uint8Array
): Promise<{ error?: string }> {
  // 1. Validate wallet address format (base58, 32-44 chars)
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet)) {
    return { error: "Invalid wallet address" };
  }

  // 2. Verify the message contains our domain prefix
  const text = new TextDecoder().decode(message);
  if (!text.startsWith("Authenticate to NÚMINA")) {
    return { error: "Invalid message format" };
  }

  // 3. Extract wallet from message and verify it matches
  const walletMatch = text.match(/Wallet: ([1-9A-HJ-NP-Za-km-z]{32,44})/);
  if (!walletMatch || walletMatch[1] !== wallet) {
    return { error: "Wallet mismatch in message" };
  }

  // 4. Verify signature against the public key
  // The message is the raw bytes that were signed
  const publicKeyBytes = base58Decode(wallet);
  if (!publicKeyBytes) {
    return { error: "Failed to decode public key" };
  }

  const isValid = await verify(signature, message, publicKeyBytes);
  if (!isValid) {
    return { error: "Invalid signature" };
  }

  // 5. Store profile
  const { error } = await requireSupabase().from("profiles").upsert(
    { wallet },
    { onConflict: "wallet" }
  );

  if (error) {
    console.error("[auth]", error.message);
    return { error: "Failed to create profile" };
  }

  return {};
}

/** Base58 decode (Solana alphabet) */
function base58Decode(str: string): Uint8Array | null {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let result = BigInt(0);
  for (const char of str) {
    const index = alphabet.indexOf(char);
    if (index === -1) return null;
    result = result * BigInt(58) + BigInt(index);
  }
  const hex = result.toString(16).padStart(64, "0");
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
