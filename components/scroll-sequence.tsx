"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import type { ScrollSequenceData } from "@/content/projects";
import { Eyebrow } from "./reveal";

/**
 * Scroll-scrubbed image sequence: a sticky canvas shows the frame that
 * matches the visitor's scroll position, so the animation plays forwards
 * and backwards with the scroll. Frames start loading just before the
 * section reaches the screen; the first frame is drawn as soon as it lands.
 */
export function ScrollSequence({ seq, title }: { seq: ScrollSequenceData; title: string }) {
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<(HTMLImageElement | undefined)[]>([]);
  const current = useRef(0);
  const [loaded, setLoaded] = useState(0);
  const [frame, setFrame] = useState(1);
  const src = (i: number) => `${seq.dir}/${seq.prefix}${String(i + 1).padStart(seq.digits, "0")}.${seq.ext}`;

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  // Cover-fit the image into the canvas at device resolution.
  const draw = (i: number) => {
    const c = canvasRef.current;
    const img = imgs.current[i] ?? imgs.current.slice(0, i).findLast((x) => x?.complete);
    if (!c || !img || !img.complete || !img.naturalWidth) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = c.clientWidth * dpr;
    const h = c.clientHeight * dpr;
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * s;
    const dh = img.naturalHeight * s;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  };

  // Load frames once the section is within a screen of the viewport.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started) return;
        started = true;
        io.disconnect();
        // First frame first, then the rest in order.
        for (let i = 0; i < seq.count; i++) {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => {
            setLoaded((n) => n + 1);
            if (i === current.current || i === 0) requestAnimationFrame(() => draw(current.current));
          };
          img.src = src(i);
          imgs.current[i] = img;
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    const onResize = () => draw(current.current);
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(seq.count - 1, Math.max(0, Math.round(p * (seq.count - 1))));
    if (i === current.current) return;
    current.current = i;
    requestAnimationFrame(() => draw(i));
    setFrame(i + 1);
  });

  const phaseIndex = Math.max(0, seq.phases.findIndex((ph) => frame <= ph.end));
  const phase = seq.phases[phaseIndex];
  const pct = Math.round((loaded / seq.count) * 100);

  return (
    <section ref={wrapRef} aria-label={`${title}: scroll-controlled 3D sequence`} className="relative h-[420svh] bg-[#05080d]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`${title} — the 3D animation advances as you scroll`}
        />
        {/* Gradient so the overlay copy always reads */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05080d]/85 via-[#05080d]/20 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#05080d] to-transparent" />
        {/* Phones: the subject sits behind the copy, so dim the whole frame a little more. */}
        <div className="pointer-events-none absolute inset-0 bg-[#05080d]/45 md:hidden" />

        <div className="shell relative flex h-full flex-col justify-between pb-28 pt-[calc(var(--nav-h)+2rem)] md:pb-14">
          <Eyebrow index="↳">Scroll to play · {seq.count} rendered frames</Eyebrow>

          <div className="max-w-xl [text-shadow:0_2px_28px_rgb(5_8_13/0.9)]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={phaseIndex}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="label text-[#5eead4]">{phase.label}</p>
                <h3 className="display mt-4 text-[clamp(2.6rem,8vw,6rem)] text-bone">{phase.title}</h3>
                <p className="mt-4 max-w-md text-lg text-bone/75">{phase.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <div className="flex items-end justify-between gap-6">
              <ol className="label hidden gap-6 text-bone/45 sm:flex">
                {seq.phases.map((ph, i) => (
                  <li key={ph.label} className={i === phaseIndex ? "text-bone" : undefined}>
                    {ph.label}
                  </li>
                ))}
              </ol>
              <p className="label tabular-nums text-bone/70">
                {loaded < seq.count ? (
                  <span>Loading frames {pct}%</span>
                ) : (
                  <>
                    Frame {String(frame).padStart(3, "0")} <span className="text-dim">/ {seq.count}</span>
                  </>
                )}
              </p>
            </div>
            <div className="mt-4 h-px w-full bg-bone/15">
              <motion.div className="h-px origin-left bg-[#5eead4]" style={{ scaleX: scrollYProgress }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
