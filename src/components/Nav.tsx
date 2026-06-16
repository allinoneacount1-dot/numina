"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { ConnectButton } from "@/components/ConnectButton";
import { site } from "@/content/site";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setMobileOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    // Focus first link in the panel
    requestAnimationFrame(() => {
      if (!panelRef.current) return;
      const firstLink = panelRef.current.querySelector<HTMLElement>("a[href]");
      firstLink?.focus();
    });

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          "a[href], button, [tabindex]:not([tabindex='-1'])"
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen, close]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-void-900/80 backdrop-blur-md border-b border-line/50"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="focus-ritual" aria-label="NUMINA home">
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
                pathname === link.href ? "text-gold-500" : "text-text-mid"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ConnectButton />
        </div>

        <button
          ref={triggerRef}
          className="md:hidden text-text-mid hover:text-gold-500 focus-ritual p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} weight="light" /> : <List size={20} weight="light" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-void-900/98 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 pb-20">
              {site.nav.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={close}
                    className={`font-[family-name:var(--font-display)] text-2xl tracking-[0.12em] transition-colors focus-ritual ${
                      pathname === link.href
                        ? "text-gold-500"
                        : "text-text-mid hover:text-gold-500"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: site.nav.length * 0.06, duration: 0.3 }}
                className="mt-4"
              >
                <div onClick={close}>
                  <ConnectButton />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
