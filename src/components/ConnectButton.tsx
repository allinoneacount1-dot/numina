"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Lightning } from "@phosphor-icons/react";

export function ConnectButton() {
  const { publicKey, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  const address = publicKey?.toBase58();
  const short = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : null;

  if (connecting) {
    return (
      <span className="px-5 py-2 border border-line/50 font-[family-name:var(--font-mono)] text-xs tracking-wider text-text-low animate-pulse">
        Awakening...
      </span>
    );
  }

  if (publicKey) {
    return (
      <div className="flex items-center gap-3">
        <span
          className="px-4 py-2 border border-aether-500/40 font-[family-name:var(--font-mono)] text-xs tracking-wider text-aether-400"
          title={address}
        >
          {short}
        </span>
        <button
          onClick={disconnect}
          className="px-4 py-2 border border-line/50 font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase text-text-mid hover:border-red-500/40 hover:text-red-400 transition-colors focus-ritual"
        >
          Sever
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="inline-flex items-center gap-2 px-5 py-2 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-300 transition-colors focus-ritual glow-gold"
    >
      <Lightning size={14} weight="fill" />
      Open the Gate
    </button>
  );
}
