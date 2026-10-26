"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMediaQuery } from "@/lib/use-media-query";

export type GalleryItem = {
  id: string;
  n: number;
  cat: string;
  catName: string;
  name: string;
  frames: number;
  video: string;
  poster: string;
};

/** Filterable grid of every item in a pack, each with a silent preview. */
export function ProductGallery({
  items,
  categories,
  fps,
}: {
  items: GalleryItem[];
  categories: { id: string; name: string }[];
  fps: number;
}) {
  const [cat, setCat] = useState<string>("all");
  const visible = cat === "all" ? items : items.filter((i) => i.cat === cat);
  const options = [{ id: "all", name: "All" }, ...categories];

  return (
    <div>
      <div role="group" aria-label="Filter transitions by style" className="flex flex-wrap gap-2">
        {options.map((o) => {
          const count = o.id === "all" ? items.length : items.filter((i) => i.cat === o.id).length;
          const active = o.id === cat;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              onClick={() => setCat(o.id)}
              className={`label rounded-full border px-4 py-2.5 transition-colors duration-300 ${
                active ? "border-bone bg-bone text-ink" : "border-line text-bone/75 hover:border-bone/50 hover:text-bone"
              }`}
            >
              {o.name}
              <sup className={`ml-1 ${active ? "text-ink/60" : "text-dim"}`}>{count}</sup>
            </button>
          );
        })}
      </div>
      <p className="sr-only" role="status">
        Showing {visible.length} transitions
      </p>

      <ul className="mt-10 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item) => (
            <motion.li
              key={item.id}
              layout="position"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0"
            >
              <GalleryTile item={item} fps={fps} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function GalleryTile({ item, fps }: { item: GalleryItem; fps: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const touch = useMediaQuery("(hover: none)");
  const [hover, setHover] = useState(false);
  const [centred, setCentred] = useState(false);
  const [ready, setReady] = useState(false);
  const playing = !reduce && ((finePointer && hover) || (touch && centred));

  useEffect(() => {
    const el = ref.current;
    if (!el || !touch) return;
    const io = new IntersectionObserver(([e]) => setCentred(e.isIntersecting), { rootMargin: "-40% 0px -40% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [touch]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    } else v.pause();
  }, [playing]);

  return (
    <figure
      ref={ref}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="group"
      data-cursor="Preview"
    >
      <div className="relative aspect-video overflow-hidden bg-ink">
        <Image src={item.poster} alt={`${item.name} transition preview`} fill sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw" className="object-cover" />
        {(playing || ready) && (
          <video
            ref={videoRef}
            src={item.video}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            onPlaying={() => setReady(true)}
            aria-hidden
            tabIndex={-1}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${playing && ready ? "opacity-100" : "opacity-0"}`}
          />
        )}
        <span className="label pointer-events-none absolute left-3 top-3 bg-ink/70 px-2 py-1 text-bone backdrop-blur-sm">
          {String(item.n).padStart(2, "0")}
        </span>
        <span
          aria-hidden
          className={`label pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-bone backdrop-blur-sm transition-opacity duration-300 ${
            playing && ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="size-1.5 rounded-full bg-signal" /> Playing
        </span>
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-3">
        <span className="min-w-0 truncate text-bone transition-colors group-hover:text-signal">{item.name}</span>
        <span className="label shrink-0 text-dim">
          {item.catName} · <span title={`Default length at ${fps} fps`}>{item.frames} f</span>
        </span>
      </figcaption>
    </figure>
  );
}
