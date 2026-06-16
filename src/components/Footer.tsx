'use client';

import Link from 'next/link';
import { site } from '@/content/site';

export function Footer() {
  return (
    <footer className="border-t border-line/50 bg-void-900">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="focus-ritual">
              <span className="font-[family-name:var(--font-display)] text-lg tracking-[0.15em] text-gold-500">
                NUMINA
              </span>
            </Link>
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-low mt-3 leading-relaxed">
              {site.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-text-low uppercase mb-4">
              Protocol
            </h4>
            <ul className="space-y-2">
              {site.nav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-[family-name:var(--font-mono)] text-[11px] text-text-mid hover:text-gold-500 transition-colors focus-ritual">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-text-low uppercase mb-4">
              Community
            </h4>
            <ul className="space-y-2">
              {site.social.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-mono)] text-[11px] text-text-mid hover:text-gold-500 transition-colors focus-ritual">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-text-low uppercase mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/lore" className="font-[family-name:var(--font-mono)] text-[11px] text-text-mid hover:text-gold-500 transition-colors focus-ritual">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="https://github.com/numina" target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-mono)] text-[11px] text-text-mid hover:text-gold-500 transition-colors focus-ritual">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line/30">
          <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low leading-relaxed">
            NUMINA is an autonomous agent protocol on Solana. AI agents are not financial advisors. Past performance does not guarantee future results. Use at your own risk. Non-custodial by design.
          </p>
          <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-low/50 mt-3">
            &copy; 2026 NUMINA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
