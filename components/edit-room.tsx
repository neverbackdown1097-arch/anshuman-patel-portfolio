"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Breakdown } from "@/content/projects";
import { Eyebrow, LineReveal, Reveal } from "./reveal";

const tc = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

/**
 * "The Edit Room": proof of craft for a project. Raw selects and the final
 * cut play side by side in sync, then matched frames compare with a wipe.
 */
export function EditRoom({ b, title }: { b: Breakdown; title: string }) {
  const d = b.display ?? {};
  const stats = d.stats ?? [
    { value: String(b.stats.delivered), label: "Raw clips delivered" },
    { value: String(b.stats.used), label: "Made the cut" },
    { value: String(b.stats.shots), label: "Shots in the cut" },
    { value: tc(b.stats.rawSeconds), label: "Of raw footage" },
    ...b.extras,
  ];
  const accentLast = (line: string) => {
    const words = line.split(" ");
    const last = words.pop();
    return (
      <>
        {words.join(" ")} <span className="font-serif normal-case italic tracking-normal text-signal">{last}</span>
      </>
    );
  };

  return (
    <section aria-labelledby="edit-room-title" className="mt-24 border-y border-line bg-coal md:mt-36">
      <div className="shell py-20 md:py-28 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow index="↳">{d.eyebrow ?? "The edit room · Raw → Final"}</Eyebrow>
            <LineReveal
              id="edit-room-title"
              lines={
                d.headline
                  ? [d.headline[0], <span key="b">{accentLast(d.headline[1])}</span>]
                  : [
                <span key="a">
                  <span className="text-signal">{tc(b.stats.rawSeconds)}</span> of raw.
                </span>,
                <span key="b">
                  {tc(b.stats.finalSeconds)} of <span className="font-serif normal-case italic tracking-normal text-signal">final.</span>
                </span>,
                    ]
              }
              className="display mt-6 text-[clamp(3rem,11vw,8.5rem)] text-bone md:mt-8 lg:text-[clamp(3rem,8vw,8.5rem)]"
            />
          </div>
          <Reveal className="lg:col-span-4 lg:pb-3" delay={0.15}>
            <p className="max-w-sm text-bone/75">
              {d.intro ??
                "The left screen plays the untouched source of every shot — no grade, no reframe, no speed change — locked frame-for-frame to the finished cut on the right. Press play and watch the edit happen."}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <dl className="mt-12 grid grid-cols-2 border-t border-line sm:grid-cols-3 lg:mt-16 lg:grid-cols-6">
            {stats.map((s) => (
              <div key={s.label} className="border-b border-line py-5 pr-4 lg:border-b-0 lg:py-7">
                <dt className="label text-dim">{s.label}</dt>
                <dd className="display mt-2 text-4xl text-bone tabular-nums md:text-5xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 lg:mt-20">
          <DualPlayer b={b} title={title} />
        </Reveal>

        <div className="mt-20 lg:mt-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="display text-[clamp(2.2rem,6vw,4rem)] text-bone">{d.compareTitle ?? "Same frame. Two worlds."}</h3>
            <p className="label text-mute">Drag across each frame</p>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-6 lg:grid-cols-3 lg:gap-y-14">
            {b.pairs.map((p, i) => (
              <li key={p.key} className="min-w-0">
                <Reveal delay={(i % 3) * 0.08}>
                  <Compare pair={p} index={i} rawTag={d.rawTag ?? "Raw"} finalTag={d.finalTag ?? "Final"} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Raw selects (muted) and the final cut (with sound) driven by one transport. */
function DualPlayer({ b, title }: { b: Breakdown; title: string }) {
  const rawRef = useRef<HTMLVideoElement>(null);
  const finRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [muted, setMuted] = useState(false);
  const dur = b.stats.finalSeconds;
  const frame = Math.floor(t * b.fps);
  const seg = Math.max(0, b.clips.findIndex((c) => frame >= c.from && frame < c.to));
  const clip = b.clips[seg];
  const d = b.display ?? {};
  const rawTag = d.rawTag ?? "Raw";
  const finalTag = d.finalTag ?? "Final";

  useEffect(() => {
    const r = rawRef.current;
    const f = finRef.current;
    return () => {
      r?.pause();
      f?.pause();
    };
  }, []);

  const toggle = async () => {
    const r = rawRef.current;
    const f = finRef.current;
    if (!r || !f) return;
    if (playing) {
      r.pause();
      f.pause();
      setPlaying(false);
      return;
    }
    if (f.ended || f.currentTime >= dur - 0.05) {
      f.currentTime = 0;
      r.currentTime = 0;
    }
    r.currentTime = f.currentTime;
    setPlaying(true);
    await Promise.allSettled([f.play(), r.play()]);
  };

  const seek = (v: number) => {
    if (finRef.current) finRef.current.currentTime = v;
    if (rawRef.current) rawRef.current.currentTime = v;
    setT(v);
  };

  const onTime = () => {
    const f = finRef.current;
    const r = rawRef.current;
    if (!f || !r) return;
    setT(f.currentTime);
    // Keep the raw reel locked to the final within a few frames.
    if (Math.abs(r.currentTime - f.currentTime) > 0.15) r.currentTime = f.currentTime;
  };

  const panel = "relative aspect-[9/16] overflow-hidden bg-ink";

  return (
    <div role="group" aria-label={`${rawTag} and ${finalTag.toLowerCase()} of ${title}, played side by side`}>
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 md:gap-5">
        <figure>
          <div className={panel}>
            <video
              ref={rawRef}
              src={b.rawReel}
              poster={b.rawPoster}
              muted
              playsInline
              preload="metadata"
              aria-hidden
              tabIndex={-1}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="label absolute left-2 top-2 bg-ink/70 px-2 py-1 text-bone backdrop-blur-sm md:left-3 md:top-3">
              {rawTag}
            </span>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2 pt-10 md:p-4 md:pt-14">
              <p className="truncate text-xs text-bone md:text-sm">{clip.label}</p>
              <p className="label mt-1 text-[0.58rem] text-bone/60 md:text-[0.65rem]">
                {clip.id ? `${clip.width}×${clip.height} · ${clip.fps} fps · ${d.rawMeta ?? "ungraded"}` : "Built in motion design"}
              </p>
            </div>
          </div>
          <figcaption className="label mt-3 text-dim">
            {b.clips.length > 1
              ? `Shot ${String(seg + 1).padStart(2, "0")} / ${b.clips.length} · same moment as the final`
              : "Frame-locked to the final"}
          </figcaption>
        </figure>
        <figure>
          <div className={panel}>
            <video
              ref={finRef}
              src={b.finalReel}
              poster={b.finalPoster}
              muted={muted}
              playsInline
              preload="metadata"
              onTimeUpdate={onTime}
              onEnded={() => {
                setPlaying(false);
                rawRef.current?.pause();
              }}
              aria-hidden
              tabIndex={-1}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="label absolute left-2 top-2 bg-signal px-2 py-1 text-ink md:left-3 md:top-3">{finalTag}</span>
          </div>
          <figcaption className="label mt-3 text-dim">{d.finalCaption ?? "Graded · cut on the beat · sound on"}</figcaption>
        </figure>
      </div>

      <div className="mx-auto mt-6 flex max-w-4xl items-center gap-3 md:gap-5">
        <button
          type="button"
          onClick={toggle}
          className="label inline-flex shrink-0 items-center gap-3 bg-bone px-5 py-3.5 text-ink transition-[background-color,transform] hover:bg-signal active:scale-95 md:px-6"
        >
          {playing ? "Pause" : t > 0 ? "Resume" : "Play both"}
          <span aria-hidden>{playing ? "❚❚" : "▶"}</span>
        </button>
        <input
          type="range"
          className="scrubber min-w-0 flex-1"
          min={0}
          max={dur}
          step={0.05}
          value={t}
          aria-label="Seek both videos"
          aria-valuetext={`${tc(t)} of ${tc(dur)}`}
          style={{ "--progress": `${(t / dur) * 100}%` } as React.CSSProperties}
          onChange={(e) => seek(Number(e.target.value))}
        />
        <span className="label hidden shrink-0 tabular-nums text-bone/70 sm:block">
          {tc(t)} <span className="text-dim">/ {tc(dur)}</span>
        </span>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="label shrink-0 rounded-full border border-line px-3 py-2.5 text-bone/80 hover:border-bone/50"
          aria-pressed={muted}
        >
          {muted ? "Sound off" : "Sound on"}
        </button>
      </div>
    </div>
  );
}

/** Before/after wipe. The handle is a real range input, so it works with keys and touch. */
function Compare({
  pair,
  index,
  rawTag,
  finalTag,
}: {
  pair: Breakdown["pairs"][number];
  index: number;
  rawTag: string;
  finalTag: string;
}) {
  const [pos, setPos] = useState(50);
  return (
    <figure>
      <div className="group/cmp relative aspect-[9/16] select-none overflow-hidden bg-ink">
        <Image src={pair.final} alt={`${finalTag}: ${pair.title}`} fill sizes="(min-width: 1024px) 30vw, 48vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={pair.raw} alt={`${rawTag}: ${pair.title}`} fill sizes="(min-width: 1024px) 30vw, 48vw" className="object-cover" />
        </div>
        {/* Divider + handle */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-bone" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone/70 bg-ink/60 text-xs text-bone backdrop-blur-sm transition-transform group-hover/cmp:scale-110">
            ⟷
          </span>
        </div>
        <span className="label pointer-events-none absolute left-2 top-2 bg-ink/70 px-2 py-1 text-bone">{rawTag}</span>
        <span className="label pointer-events-none absolute right-2 top-2 bg-signal px-2 py-1 text-ink">{finalTag}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare ${rawTag.toLowerCase()} and ${finalTag.toLowerCase()}: ${pair.title}`}
          aria-valuetext={`${pos}% ${rawTag.toLowerCase()}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize touch-pan-y opacity-0"
        />
      </div>
      <figcaption className="mt-4">
        <p className="flex items-baseline gap-3">
          <span className="label text-signal">{String(index + 1).padStart(2, "0")}</span>
          <span className="font-display text-xl uppercase leading-none text-bone md:text-2xl">{pair.title}</span>
        </p>
        <ul className="mt-3 space-y-1.5 text-xs text-bone/70 md:text-sm">
          {pair.changes.map((c) => (
            <li key={c} className="flex gap-2">
              <span aria-hidden className="text-signal">
                +
              </span>
              {c}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
