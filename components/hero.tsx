"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { site } from "@/content/site";
import { useIsClient, useMediaQuery } from "@/lib/use-media-query";
import { EASE, LineReveal } from "./reveal";

/**
 * Full-bleed hero: a silent, text-free montage loops behind oversized type.
 * The loop is only attached after hydration, never with reduced motion or
 * Save-Data, and the poster image covers the gap so nothing shifts.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const isClient = useIsClient();
  const small = useMediaQuery("(max-width: 767px)");
  const saveData =
    isClient && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  const videoSrc = isClient && !reduce && !saveData ? (small ? site.hero.videoMobile : site.hero.video) : null;

  // Pause the loop while the hero is off-screen or this route is hidden.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoSrc) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => {
      io.disconnect();
      v.pause();
    };
  }, [videoSrc]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);

  const lines = site.hero.lines;

  return (
    <section ref={ref} aria-label="Introduction" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: mediaY }} aria-hidden>
        <Image
          src={site.hero.poster}
          alt=""
          fill
          preload
          sizes="100vw"
          className="scale-105 object-cover"
        />
        {videoSrc && (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full scale-105 object-cover transition-opacity duration-[1.6s] ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            src={videoSrc}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            onCanPlay={() => setReady(true)}
            tabIndex={-1}
          />
        )}
        {/* Legibility: deep vignette plus a bottom fade into the page. */}
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,transparent_0%,rgb(10_10_10/0.75)_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />
      </motion.div>

      {/* Viewfinder corners */}
      <div aria-hidden className="corners pointer-events-none absolute inset-x-[var(--gutter)] bottom-6 top-[calc(var(--nav-h)+0.5rem)] text-bone/30" />

      <motion.div style={{ y: textY }} className="shell relative flex flex-1 flex-col justify-end pb-24 pt-[calc(var(--nav-h)+3rem)] md:pb-28">
        <motion.p
          className="label mb-8 flex items-center gap-3 text-bone/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="text-signal">●</span> {site.hero.label}
        </motion.p>

        <LineReveal
          as="h1"
          immediate
          delay={0.25}
          stagger={0.12}
          lines={lines.map((line, i) =>
            i === lines.length - 1 && line.endsWith(".") ? (
              <span key={i}>
                {line.slice(0, -1)}
                <span className="text-signal">.</span>
              </span>
            ) : (
              line
            ),
          )}
          className="display text-[17.5vw] leading-[0.86] text-bone md:text-[clamp(3.6rem,13.2vw,15rem)]"
        />

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end">
          <motion.p
            className="max-w-md text-lg leading-snug text-bone/85 md:col-span-5 md:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.85 }}
          >
            {site.hero.intro}
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3 md:col-span-7 md:justify-end"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1 }}
          >
            <Link
              href="/#work"
              className="label group inline-flex items-center gap-3 bg-bone px-6 py-4 text-ink transition-colors duration-300 hover:bg-signal"
            >
              Explore my work
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/#contact"
              className="label group inline-flex items-center gap-3 border border-bone/40 px-6 py-4 text-bone transition-colors duration-300 hover:border-bone hover:bg-bone/5"
            >
              Let&apos;s work together
              <span aria-hidden className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#showreel"
        className="label absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-bone/60 hover:text-bone md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        Scroll
        <span aria-hidden className="relative h-10 w-px overflow-hidden bg-bone/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-bone motion-safe:animate-[scrollcue_2.4s_cubic-bezier(.65,0,.35,1)_3]" />
        </span>
      </motion.a>
    </section>
  );
}
