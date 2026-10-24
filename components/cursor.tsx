"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * A small dot that trails the pointer and grows into a labelled disc over
 * elements with a data-cursor attribute (e.g. data-cursor="View").
 * Only mounts on devices with a fine pointer and hover, and never when the
 * visitor prefers reduced motion. Purely decorative: aria-hidden.
 */
export function Cursor() {
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(target?.dataset.cursor ?? null);
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] mix-blend-normal"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="label flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-signal text-[0.625rem] text-ink"
        animate={{
          width: label ? 88 : 8,
          height: label ? 88 : 8,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        <motion.span animate={{ opacity: label ? 1 : 0 }} transition={{ duration: 0.2 }}>
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
