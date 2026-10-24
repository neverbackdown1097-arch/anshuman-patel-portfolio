"use client";

import { MotionConfig } from "motion/react";

/** Motion honours the OS "reduce motion" setting: transforms are skipped, fades stay. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </MotionConfig>
  );
}
