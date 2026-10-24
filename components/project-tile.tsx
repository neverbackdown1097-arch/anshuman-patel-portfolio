"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { formatDuration, type Project } from "@/content/projects";
import { ClipReveal } from "./reveal";

/**
 * Gallery card. Poster at rest; on hover or keyboard focus (fine pointers,
 * motion allowed) a silent preview loop fades in. Title, categories and
 * format are always visible below, so touch users get the same details.
 */
export function ProjectTile({ project, index, sizes }: { project: Project; index: number; sizes: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [previewing, setPreviewing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const vertical = project.format === "9:16";

  const canPreview = () =>
    Boolean(project.media.preview) &&
    window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;

  const start = () => {
    if (!canPreview()) return;
    setPreviewing(true);
    void videoRef.current?.play().catch(() => {});
  };
  const stop = () => {
    setPreviewing(false);
    videoRef.current?.pause();
  };

  return (
    <article className="group">
      <Link
        href={`/work/${project.slug}`}
        data-cursor="View"
        onPointerEnter={start}
        onPointerLeave={stop}
        onFocus={start}
        onBlur={stop}
        className="block"
      >
        <ClipReveal className={`relative overflow-hidden bg-coal ${vertical ? "aspect-[3/4]" : "aspect-video"}`}>
          <Image
            src={project.media.poster}
            alt={project.media.posterAlt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
          />
          {previewing && project.media.preview && (
            <video
              ref={videoRef}
              src={project.media.preview}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              onPlaying={() => setLoaded(true)}
              className={`absolute inset-0 h-full w-full scale-[1.04] object-cover transition-opacity duration-700 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden
              tabIndex={-1}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-40" />
          {project.placeholder && (
            <span className="label absolute bottom-3 left-3 bg-signal px-2 py-1 text-ink">Placeholder</span>
          )}
          <span
            aria-hidden
            className="label pointer-events-none absolute bottom-4 right-4 hidden translate-y-2 items-center gap-2 text-bone opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:flex"
          >
            View case study →
          </span>
        </ClipReveal>

        <div className="mt-4 flex items-start justify-between gap-6 md:mt-5">
          <div className="flex gap-4">
            <span className="label pt-1.5 text-signal">{String(index + 1).padStart(2, "0")}</span>
            <div>
            <h3 className="font-display text-2xl uppercase leading-none tracking-[0.01em] text-bone transition-colors duration-300 group-hover:text-signal md:text-[1.9rem]">
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
