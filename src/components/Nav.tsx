'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { site } from '@/content/site';

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-void-900/80 backdrop-blur-md border-b border-line/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="focus-ritual">
            <span className="font-[family-name:var(--font-display)] text-lg tracking-[0.15em] text-gold-500">
              NUMINA
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {site.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-[family-name:var(--font-mono)] tracking-wider uppercase transition-colors hover:text-gold-500 focus-ritual ${
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    ? 'text-gold-500'
                    : 'text-text-mid'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/sanctum"
              className="text-xs font-[family-name:var(--font-mono)] tracking-wider uppercase px-5 py-2 bg-gold-500 text-void-900 hover:bg-gold-300 transition-colors focus-ritual font-medium"
            >
              Open the Gate
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-text-mid hover:text-gold-500 focus-ritual p-2"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? (
                <path d="M4 4L16 16M16 4L4 16" />
              ) : (
                <>
                  <path d="M2 5H18" />
                  <path d="M2 10H18" />
                  <path d="M2 15H18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-void-900/98 backdrop-blur-lg flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-5 right-5 text-text-mid hover:text-gold-500 focus-ritual p-2"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6L18 18M18 6L6 18" />
              </svg>
            </button>
            <div className="flex flex-col items-center gap-8">
              {site.nav.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`font-[family-name:var(--font-display)] text-3xl tracking-wider transition-colors focus-ritual ${
                      pathname === link.href ? 'text-gold-500' : 'text-text-mid hover:text-text-hi'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: site.nav.length * 0.08 }}
              >
                <Link
                  href="/sanctum"
                  onClick={() => setMenuOpen(false)}
                  className="inline-block px-8 py-3 bg-gold-500 text-void-900 font-[family-name:var(--font-mono)] text-sm tracking-wider uppercase hover:bg-gold-300 transition-colors focus-ritual"
                >
                  Open the Gate
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
