/**
 * Sigil NFT Minting via Metaplex Core
 */

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  signerIdentity,
  createGenericFile,
} from "@metaplex-foundation/umi";
import {
  mplCore,
  create,
  fetchAsset,
} from "@metaplex-foundation/mpl-core";
import { SOLANA_RPC_URL } from "./solana";
import { generateSigilSVG, sigilToBytes } from "./sigil";

export interface MintResult {
  mint: string;
  uri: string;
  svg: string;
}

export class MintError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "MintError";
  }
}

function getUmi(walletSigner: { publicKey: { toBytes(): Uint8Array }; signTransaction?: (tx: Uint8Array) => Promise<Uint8Array> }) {
  const umi = createUmi(SOLANA_RPC_URL)
    .use(mplCore())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Umi signer identity type is complex
    .use(signerIdentity(walletSigner as any));

  return umi;
}

export async function mintSigil(
  seed: string,
  name: string,
  walletSigner: { publicKey: { toBytes(): Uint8Array }; signTransaction?: (tx: Uint8Array) => Promise<Uint8Array> }
): Promise<MintResult> {
  if (!seed || seed.length > 128) {
    throw new MintError("Invalid seed");
  }
  if (!name || name.length > 64) {
    throw new MintError("Invalid name");
  }

  const umi = getUmi(walletSigner);

  // 1. Generate deterministic SVG
  const svg = generateSigilSVG(seed, 400);

  // 2. Create generic file for upload
  const file = createGenericFile(sigilToBytes(svg), "sigil.svg", {
    contentType: "image/svg+xml",
  });

  // 3. Upload to Bundlr (devnet: free; mainnet: requires funds)
  let uri: string;
  try {
    const [uploadedUri] = await umi.uploader.upload([file]);
    uri = uploadedUri;
  } catch (uploadErr) {
    // Fallback: data URI (wallets may not display, but mint succeeds)
    console.warn("[mint] Upload failed, using data URI:", uploadErr);
    uri = `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  // 4. Generate mint signer
  const mint = generateSigner(umi);

  // 5. Mint via Metaplex Core
  try {
    await create(umi, {
      asset: mint,
      name,
      uri,
    }).sendAndConfirm(umi);
  } catch (txErr) {
    throw new MintError(
      `Transaction failed: ${txErr instanceof Error ? txErr.message : "unknown error"}`,
      txErr
    );
  }

  return {
    mint: mint.publicKey.toString(),
    uri,
    svg,
  };
}

export async function fetchSigil(mintAddress: string) {
  if (!mintAddress || mintAddress.length > 128) {
    throw new MintError("Invalid mint address");
  }
  const umi = createUmi(SOLANA_RPC_URL).use(mplCore());
  const asset = await fetchAsset(umi, mintAddress);
  return asset;
}
