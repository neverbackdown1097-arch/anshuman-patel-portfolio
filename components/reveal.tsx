"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children once, when they scroll into view. */
export function Reveal({
  delay = 0,
  y = 28,
  className,
  children,
  ...rest
}: { delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Masked line-by-line headline reveal, like a title card wiping in.
 * Each line slides up from behind its own mask with a short stagger.
 */
export function LineReveal({
  id,
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  immediate = false,
}: {
  id?: string;
  /** Each entry is one masked line; may contain markup (e.g. an accent span). */
  lines: readonly React.ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of on scroll (for above-the-fold text). */
  immediate?: boolean;
}) {
  const trigger = immediate
    ? { animate: "shown" }
    : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <Tag id={id} className={className}>
      <motion.span className="block" initial="hidden" {...trigger}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
            <motion.span
              className={`block ${lineClassName ?? ""}`}
              variants={{
                hidden: { y: "105%" },
                shown: { y: "0%", transition: { duration: 1.1, ease: EASE, delay: delay + i * stagger } },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Image/video frame that wipes open from the bottom when it enters view. */
export function ClipReveal({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.25, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Small mono label with a leading index, e.g. "01 — Selected work". */
export function Eyebrow({ index, children, className = "" }: { index?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`label flex items-center gap-3 text-mute ${className}`}>
      {index && <span className="text-signal">{index}</span>}
      {index && <span aria-hidden className="h-px w-8 bg-line" />}
      <span>{children}</span>
    </p>
  );
}
