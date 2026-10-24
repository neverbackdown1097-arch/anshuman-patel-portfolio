"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { formatPhone, site } from "@/content/site";
import { inquire } from "./contact-form";
import { EASE } from "./reveal";

/** Scrolls to the contact form with this service's project type pre-selected. */
export function InquireButton({ type, service }: { type: string; service: string }) {
  return (
    <a
      href="#contact"
      onClick={() => inquire(type)}
      className="label group/i -my-2 inline-flex items-center gap-2 py-2 text-bone/85 hover:text-signal active:text-signal"
    >
      Start a project
      <span aria-hidden className="transition-transform duration-500 group-hover/i:translate-x-1">
        →
      </span>
      <span className="sr-only"> — {service}</span>
    </a>
  );
}

/**
 * Two rows of oversized words that slide in opposite directions as the page
 * scrolls — motion tied to the visitor's own scrolling, never a perpetual loop.
 */
export function ScrollMarquee({ items }: { items: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const left = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-28%"]);
  const right = useTransform(scrollYProgress, [0, 1], reduce ? ["-14%", "-14%"] : ["-28%", "0%"]);
  const row = [...items, ...items, ...items];

  return (
    <div ref={ref} aria-hidden className="select-none overflow-hidden border-y border-line py-6 md:py-10">
      {[left, right].map((x, r) => (
        <motion.div key={r} style={{ x }} className="flex w-max items-center gap-6 whitespace-nowrap md:gap-10">
          {row.map((item, i) => (
            <span key={i} className="flex items-center gap-6 md:gap-10">
              <span
                className={`display text-[clamp(2.75rem,9vw,7.5rem)] leading-[1.05] ${
                  (i + r) % 2 ? "text-transparent [-webkit-text-stroke:1px_rgb(238_234_226/0.55)]" : "text-bone"
                }`}
              >
                {item}
              </span>
              <span className="text-[clamp(1.25rem,3vw,2.5rem)] text-signal">✦</span>
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

/** Four steps joined by a hairline that draws itself as the section scrolls. */
export function ProcessSteps({ steps }: { steps: readonly { title: string; body: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-x-10 md:gap-y-14 lg:mt-24 lg:grid-cols-4 lg:gap-8">
      {/* Track + drawn line: horizontal on large screens, vertical below. */}
      <span aria-hidden className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-line lg:left-0 lg:top-[5px] lg:h-px lg:w-full" />
      <motion.span
        aria-hidden
        className="absolute left-0 top-[5px] hidden h-px w-full origin-left bg-signal lg:block"
        style={{ scaleX: progress }}
      />
      <motion.span
        aria-hidden
        className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-signal lg:hidden"
        style={{ scaleY: progress }}
      />
      {steps.map((s, i) => (
        <motion.li
          key={s.title}
          className="relative pl-10 lg:pl-0 lg:pt-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1, ease: EASE, delay: (i % 2) * 0.12 }}
        >
          <span aria-hidden className="absolute left-0 top-1.5 size-[11px] rounded-full border border-signal bg-ink lg:top-0" />
          <p className="label text-signal">{String(i + 1).padStart(2, "0")} —</p>
          <h3 className="display mt-4 text-[clamp(2.75rem,12vw,3.75rem)] text-bone lg:text-[clamp(2.5rem,4vw,3.75rem)]">
            {s.title}
          </h3>
          <p className="mt-4 max-w-xs text-bone/70">{s.body}</p>
        </motion.li>
      ))}
    </ol>
  );
}

/** Email, call and WhatsApp as large tap targets, with copy-to-clipboard for the email. */
export function ContactDirect() {
  const { email, phone, whatsapp } = site.social;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  const rowCls = "group flex min-h-16 items-center justify-between gap-4 border-b border-line py-4";
  const action = "label shrink-0 rounded-full border border-line px-4 py-2.5 text-bone/85 transition-colors hover:border-signal hover:text-signal active:border-signal active:text-signal";

  return (
    <ul className="border-t border-line">
      {email && (
        <li className={rowCls}>
          <a href={`mailto:${email}`} className="min-w-0">
            <span className="label block text-dim">Email</span>
            <span className="mt-1 block truncate text-lg text-bone group-hover:text-signal md:text-2xl">{email}</span>
          </a>
          <button type="button" onClick={copy} className={action} aria-live="polite">
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </li>
      )}
      {phone && (
        <li className={rowCls}>
          <a href={`tel:+${phone}`} className="min-w-0">
            <span className="label block text-dim">Phone</span>
            <span className="mt-1 block text-lg tabular-nums text-bone group-hover:text-signal md:text-2xl">{formatPhone(phone)}</span>
          </a>
          <div className="flex gap-2">
            <a href={`tel:+${phone}`} className={action}>
              Call
            </a>
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={action}>
                WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </li>
      )}
    </ul>
  );
}
