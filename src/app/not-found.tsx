import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-[family-name:var(--font-display)] text-8xl md:text-9xl font-bold text-line/30 mb-6">
          404
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-wider text-text-hi mb-4">
          Lost in the Silence
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-text-mid mb-8 max-w-md">
          The signal was lost. This path does not exist on the chain.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 border border-gold-500/30 text-gold-500 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase hover:bg-gold-500/10 transition-all focus-ritual"
        >
          Return to the Gate
        </Link>
      </div>
    </main>
  );
}
