import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { NUMINA_PROGRAM_ID } from "./solana";

// Anchor 0.32 IDL format — will be replaced by generated IDL after `anchor build`
export const NUMINA_IDL = {
  address: NUMINA_PROGRAM_ID,
  metadata: { name: "numina", version: "0.1.0", spec: "0.1.0" },
  instructions: [
    {
      name: "invokeNumen",
      discriminator: [183, 93, 249, 11, 98, 91, 74, 145],
      accounts: [
        { name: "owner", writable: true, signer: true },
        { name: "numen", writable: true },
        { name: "systemProgram", address: "11111111111111111111111111111111" },
      ],
      args: [
        { name: "seed", type: "bytes" },
        { name: "budget", type: "u64" },
        { name: "maxPerTx", type: "u64" },
      ],
    },
    {
      name: "setStatus",
      discriminator: [108, 194, 24, 205, 247, 46, 133, 186],
      accounts: [
        { name: "owner", writable: true, signer: true },
        { name: "numen", writable: true },
      ],
      args: [{ name: "status", type: "u8" }],
    },
    {
      name: "executeAction",
      discriminator: [225, 53, 149, 183, 47, 166, 222, 52],
      accounts: [
        { name: "authority", writable: true, signer: true },
        { name: "numen", writable: true },
      ],
      args: [{ name: "ixData", type: "bytes" }],
    },
    {
      name: "revoke",
      discriminator: [122, 89, 160, 218, 87, 247, 104, 118],
      accounts: [
        { name: "owner", writable: true, signer: true },
        { name: "numen", writable: true },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "Numen",
      discriminator: [77, 114, 97, 110, 99, 105, 115, 105],
    },
  ],
  errors: [
    { code: 6000, name: "BudgetExceeded", msg: "Action exceeds remaining budget" },
    { code: 6001, name: "MaxPerTxExceeded", msg: "Action exceeds max per tx limit" },
    { code: 6002, name: "Unauthorized", msg: "Signer is not the authority" },
    { code: 6003, name: "NumenNotAwake", msg: "Numen is not awake" },
  ],
  types: [
    {
      name: "Numen",
      type: {
        kind: "struct",
        fields: [
          { name: "owner", type: "pubkey" },
          { name: "authority", type: "pubkey" },
          { name: "budgetLamports", type: "u64" },
          { name: "spent", type: "u64" },
          { name: "maxPerTx", type: "u64" },
          { name: "status", type: "u8" },
          { name: "bump", type: "u8" },
        ],
      },
    },
  ],
} satisfies Idl;

export function getProgram(connection: Connection) {
  const provider = new AnchorProvider(connection, {} as never, {
    commitment: "confirmed",
  });
  return new Program(NUMINA_IDL, provider);
}

/** Derive PDA for a numen account */
export function deriveNumenPda(
  ownerPubkey: PublicKey,
  seed: Uint8Array
): [PublicKey, number] {
  const programId = new PublicKey(NUMINA_PROGRAM_ID);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("numen"), ownerPubkey.toBuffer(), seed],
    programId
  );
}
