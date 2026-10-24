"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { formatDuration, type Project } from "@/content/projects";
import { useMediaQuery } from "@/lib/use-media-query";
import { ClipReveal } from "./reveal";

/**
 * Gallery card. Poster at rest. On hover/focus (mouse) — or, on touch
 * screens, while the card crosses the middle of the viewport — a silent
 * preview loop fades in. The frame also eases from a slight zoom as it
 * scrolls into place. Details are always visible below the frame.
 */
export function ProjectTile({ project, index, sizes }: { project: Project; index: number; sizes: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);
  const [centred, setCentred] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const reduce = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const touch = useMediaQuery("(hover: none)");
  const vertical = project.format === "9:16";
  const hasPreview = Boolean(project.media.preview) && !reduce;
  const previewing = hasPreview && ((finePointer && hovering) || (touch && centred));

  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "center center"] });
  const zoom = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.14, 1]);

  // Touch screens: play while the card sits in the central band of the screen.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || !touch || !hasPreview) return;
    const io = new IntersectionObserver(([e]) => setCentred(e.isIntersecting), {
      rootMargin: "-38% 0px -38% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [touch, hasPreview]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (previewing) void v.play().catch(() => {});
    else v.pause();
  }, [previewing]);

  return (
    <article className="group">
      <Link
        href={`/work/${project.slug}`}
        data-cursor="View"
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        className="block transition-transform duration-300 active:scale-[0.985]"
      >
        <div ref={frameRef}>
          <ClipReveal
            className={`relative overflow-hidden bg-coal ${vertical ? "aspect-[4/5] lg:aspect-[3/4]" : "aspect-video"}`}
          >
            <motion.div className="absolute inset-0" style={{ scale: zoom }}>
              <Image
                src={project.media.poster}
                alt={project.media.posterAlt}
                fill
                sizes={sizes}
                className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
              />
              {(previewing || loaded) && project.media.preview && (
                <video
                  ref={videoRef}
                  src={project.media.preview}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="auto"
                  onPlaying={() => setLoaded(true)}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    previewing && loaded ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden
                  tabIndex={-1}
                />
              )}
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-40" />
            {project.breakdown && (
              <span className="label pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 bg-bone px-2.5 py-1.5 text-ink">
                Raw <span aria-hidden className="text-signal">→</span> Final
              </span>
            )}
            {project.placeholder && (
              <span className="label absolute bottom-3 left-3 bg-signal px-2 py-1 text-ink">Placeholder</span>
            )}
            {/* Small "playing" chip so touch users know the preview is live. */}
            <span
              aria-hidden
              className={`label pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full bg-ink/60 px-3 py-1.5 text-bone backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
                previewing && loaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="size-1.5 rounded-full bg-signal" /> Preview
            </span>
            <span
              aria-hidden
              className="label pointer-events-none absolute bottom-4 right-4 hidden translate-y-2 items-center gap-2 text-bone opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 lg:flex"
            >
              View case study →
            </span>
          </ClipReveal>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4 md:mt-5">
          <div className="flex min-w-0 gap-3 md:gap-4">
            <span className="label pt-1.5 text-signal">{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <h3 className="font-display text-[1.6rem] uppercase leading-none tracking-[0.01em] text-bone transition-colors duration-300 group-hover:text-signal md:text-[1.75rem] lg:text-[1.9rem]">
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-mute">
                {project.brand ? `${project.brand} — ${project.subtitle}` : project.subtitle}
              </p>
              <p className="label mt-3 text-mute">{project.categories.join(" · ")}</p>
            </div>
          </div>
          <p className="label shrink-0 pt-1 text-right text-dim">
            {project.format} · {formatDuration(project.duration)}
            <span className="block">{project.date.slice(0, 4)}</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
