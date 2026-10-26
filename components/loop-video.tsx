"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Silent decorative loop: loads and plays only while on screen, pauses when
 * it leaves, and never plays for visitors who prefer reduced motion (the
 * poster shows instead).
 */
export function LoopVideo({ src, poster, className = "" }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(v);
    return () => {
      io.disconnect();
      v.pause();
    };
  }, [reduce]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (visible) void v.play().catch(() => {});
    else v.pause();
  }, [visible]);

  return (
    <video
      ref={ref}
      src={reduce ? undefined : src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
      className={className}
    />
  );
}
