"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { inquire } from "./contact-form";
import { EASE } from "./reveal";

/** Scrolls to the contact form with this service's project type pre-selected. */
export function InquireButton({ type, service }: { type: string; service: string }) {
  return (
    <a
      href="#contact"
      onClick={() => inquire(type)}
      className="label group/i inline-flex items-center gap-2 text-bone/85 hover:text-signal"
    >
      Start a project
      <span aria-hidden className="transition-transform duration-500 group-hover/i:translate-x-1">
        →
      </span>
      <span className="sr-only"> — {service}</span>
    </a>
  );
}

/** Four steps joined by a hairline that draws itself as the section scrolls. */
export function ProcessSteps({ steps }: { steps: readonly { title: string; body: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative mt-16 grid gap-12 md:mt-24 md:grid-cols-4 md:gap-8">
      {/* Track + drawn line: horizontal on desktop, vertical on phones. */}
      <span aria-hidden className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-line md:left-0 md:top-[5px] md:h-px md:w-full" />
      <motion.span
        aria-hidden
        className="absolute left-[5px] top-2 hidden h-px w-full origin-left bg-signal md:left-0 md:top-[5px] md:block"
        style={{ scaleX: progress }}
      />
      <motion.span
        aria-hidden
        className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-signal md:hidden"
        style={{ scaleY: progress }}
      />
      {steps.map((s, i) => (
        <motion.li
          key={s.title}
          className="relative pl-10 md:pl-0 md:pt-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1, ease: EASE, delay: i * 0.12 }}
        >
          <span aria-hidden className="absolute left-0 top-1.5 size-[11px] rounded-full border border-signal bg-ink md:top-0" />
          <p className="label text-signal">{String(i + 1).padStart(2, "0")} —</p>
          <h3 className="display mt-4 text-5xl text-bone md:text-6xl">{s.title}</h3>
          <p className="mt-4 max-w-xs text-bone/70">{s.body}</p>
        </motion.li>
      ))}
    </ol>
  );
}
