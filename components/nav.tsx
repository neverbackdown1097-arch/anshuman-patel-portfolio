"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navItems, site, socialLinks } from "@/content/site";
import { EASE } from "./reveal";

export function Availability({ className = "" }: { className?: string }) {
  if (!site.availability.open) return null;
  return (
    <p className={`label flex items-center gap-2.5 text-bone/80 ${className}`}>
      <span className="relative flex size-2" aria-hidden>
        <span className="absolute inset-0 rounded-full bg-live opacity-60 motion-safe:animate-ping [animation-iteration-count:3]" />
        <span className="relative size-2 rounded-full bg-live" />
      </span>
      {site.availability.label}
    </p>
  );
}

export function Wordmark() {
  return (
    <>
      {site.wordmark}
      <sup className="ml-0.5 align-super text-[0.6em]">®</sup>
    </>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu open: lock page scroll, close on Escape, keep Tab inside the menu.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const button = buttonRef.current;
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !menuRef.current) return;
      const focusables = [button, ...menuRef.current.querySelectorAll<HTMLElement>("a")].filter(Boolean) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled && !open ? "border-b border-line bg-ink/75 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Primary" className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
        <Link
          href="/"
          className="relative z-10 font-display text-[1.05rem] tracking-[0.06em] text-bone"
          aria-label={`${site.name}, home`}
          onClick={() => setOpen(false)}
        >
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          <Availability className="hidden lg:flex" />
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="label link-underline py-1 text-bone/85 hover:text-bone">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="label relative z-10 -mr-2 flex items-center gap-3 px-2 py-3 text-bone md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span aria-hidden className="relative block h-2.5 w-6">
            <span
              className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ${open ? "top-1/2 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 flex flex-col bg-ink md:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="shell flex flex-1 flex-col justify-between pb-10 pt-[calc(var(--nav-h)+2rem)]">
              <ul className="space-y-1">
                {navItems.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.06 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="display flex items-baseline gap-4 pb-1 pt-2 text-[clamp(3.5rem,17vw,6rem)] leading-none text-bone"
                      >
                        <span className="label text-signal">0{i + 1}</span>
                        {item.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
              <div className="space-y-6">
                <Availability />
                <ul className="flex flex-wrap gap-x-6 gap-y-3">
                  {socialLinks().map((s) => (
                    <li key={s.key}>
                      <a
                        href={s.href}
                        className="label text-mute hover:text-bone"
                        {...(s.key === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
