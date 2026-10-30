"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatDuration } from "@/content/projects";
import { useIsClient } from "@/lib/use-media-query";
import type { Format } from "@/lib/format";

type Status = "idle" | "loading" | "playing" | "paused" | "ended" | "error";

type Props = {
  src: string;
  poster: string;
  posterAlt: string;
  title: string;
  format?: Format;
  /** Known running time, shown before metadata loads. */
  duration?: number;
  /** Load the poster eagerly (for players above the fold). */
  preload?: boolean;
  sizes?: string;
};

const fmt = (t: number) => (Number.isFinite(t) ? formatDuration(Math.floor(t)) : "0:00");

/**
 * Cinematic video player with a custom poster, keyboard shortcuts
 * (Space/K play, M mute, F fullscreen, ←/→ seek), fullscreen, and
 * explicit loading, ended and error states.
 */
export function VideoPlayer({ src, poster, posterAlt, title, format = "16:9", duration, preload, sizes }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<number>(undefined);
  const [status, setStatus] = useState<Status>(src ? "idle" : "error");
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [length, setLength] = useState(duration ?? 0);
  const [muted, setMuted] = useState(false);
  const [chrome, setChrome] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isClient = useIsClient();
  const canFullscreen =
    isClient &&
    (Boolean(document.fullscreenEnabled) ||
      // iOS Safari only supports fullscreen on the <video> element itself.
      "webkitEnterFullscreen" in HTMLVideoElement.prototype);

  useEffect(() => {
    const onFs = () => setIsFullscreen(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onFs);
    const video = videoRef.current;
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      // Pause when this view is hidden or unmounted (routes stay mounted in the background).
      video?.pause();
    };
  }, []);

  const play = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    try {
      if (v.ended) v.currentTime = 0;
      await v.play();
    } catch (err) {
      if ((err as DOMException)?.name !== "AbortError") setStatus("error");
    }
  }, []);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v || status === "error") return;
    if (v.paused || v.ended) void play();
    else v.pause();
  }, [play, status]);

  const toggleFullscreen = useCallback(() => {
    const wrap = wrapRef.current;
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!wrap || !v) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (wrap.requestFullscreen) void wrap.requestFullscreen();
    else v.webkitEnterFullscreen?.();
  }, []);

  const seekBy = (delta: number) => {
    const v = videoRef.current;
    if (v && Number.isFinite(v.duration)) v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration);
  };

  const poke = useCallback(() => {
    setChrome(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (!videoRef.current?.paused && !wrapRef.current?.contains(document.activeElement)) setChrome(false);
    }, 2600);
  }, []);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    const inControl = tag === "BUTTON" || tag === "INPUT";
    switch (e.key.toLowerCase()) {
      case " ":
      case "k":
        if (inControl && e.key === " ") return;
        e.preventDefault();
        toggle();
        break;
      case "m":
        e.preventDefault();
        if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
        break;
      case "f":
        e.preventDefault();
        toggleFullscreen();
        break;
      case "arrowleft":
      case "arrowright":
        if (tag === "INPUT") return;
        e.preventDefault();
        seekBy(e.key === "ArrowLeft" ? -5 : 5);
        break;
    }
    poke();
  };

  const vertical = format === "9:16";
  const progress = length ? (time / length) * 100 : 0;
  const showPoster = !started || status === "error";
  const label = status === "playing" ? `Pause ${title}` : status === "ended" ? `Replay ${title}` : `Play ${title}`;

  return (
    <div
      ref={wrapRef}
      role="group"
      aria-label={`${title} video player`}
      onKeyDown={onKeyDown}
      onPointerMove={poke}
      onFocus={poke}
      className={`group/player relative overflow-hidden bg-coal ${
        isFullscreen ? "flex h-full w-full items-center justify-center bg-black" : ""
      } ${
        vertical && !isFullscreen
          ? "mx-auto aspect-[9/16] max-h-[86svh] w-auto max-w-full"
          : format === "4:3" && !isFullscreen
            ? "mx-auto aspect-[4/3] w-full max-w-[min(100%,calc(86svh*4/3))]"
            : "aspect-video w-full"
      }`}
      style={vertical && !isFullscreen ? { height: "min(86svh, 1100px)" } : undefined}
    >
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full ${isFullscreen ? "object-contain" : "object-cover"}`}
        src={src || undefined}
        poster={poster}
        playsInline
        preload="none"
        onClick={toggle}
        onPlay={() => setStatus("playing")}
        onPause={() => setStatus((s) => (s === "ended" || s === "error" ? s : "paused"))}
        onWaiting={() => setStatus("loading")}
        onPlaying={() => setStatus("playing")}
        onEnded={() => {
          setStatus("ended");
          setChrome(true);
        }}
        onError={() => setStatus("error")}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setLength(e.currentTarget.duration)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        aria-hidden
        tabIndex={-1}
      />

      {/* Poster frame, served responsively by next/image. */}
      <AnimatePresence>
        {showPoster && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
          >
            <Image
              src={poster}
              alt={posterAlt}
              fill
              sizes={sizes ?? (vertical ? "(min-width: 768px) 40vw, 90vw" : "(min-width: 1280px) 85vw, 100vw")}
              className="object-cover"
              preload={preload}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Big centre button for the first play, replay and errors. */}
      {status === "error" ? (
        <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/70 p-6 text-center">
          <p className="label text-signal">{src ? "Playback unavailable" : "Coming soon"}</p>
          <p className="max-w-sm text-sm text-bone/80">
            {src
              ? "This video couldn't be loaded right now. Please refresh, or try again in a moment."
              : "The full video will be added here shortly."}
          </p>
        </div>
      ) : (
        (status === "idle" || status === "ended") && (
          <button
            type="button"
            onClick={() => void play()}
            data-cursor={status === "ended" ? "Replay" : "Play"}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={label}
          >
            <span className="flex items-center gap-4">
              <span className="flex size-20 items-center justify-center rounded-full border border-bone/40 bg-ink/30 backdrop-blur-sm transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover/player:scale-110 group-hover/player:border-signal group-hover/player:bg-signal md:size-24">
                {status === "ended" ? <ReplayIcon /> : <PlayIcon />}
              </span>
              <span className="label hidden text-bone sm:block">
                {status === "ended" ? "Replay" : "Play film"}
                <span className="block text-mute">{fmt(length)}</span>
              </span>
            </span>
          </button>
        )
      )}

      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <span className="size-10 animate-spin rounded-full border-2 border-bone/20 border-t-signal" />
        </div>
      )}

      {/* Control bar */}
      {started && status !== "error" && (
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-10 transition-opacity duration-500 md:px-5 md:pb-3 ${
            chrome || status !== "playing" ? "opacity-100" : "opacity-0 focus-within:opacity-100"
          }`}
        >
          <input
            type="range"
            className="scrubber block w-full"
            min={0}
            max={length || 0}
            step={0.1}
            value={time}
            aria-label="Seek"
            aria-valuetext={`${fmt(time)} of ${fmt(length)}`}
            style={{ "--progress": `${progress}%` } as React.CSSProperties}
            onChange={(e) => {
              const v = videoRef.current;
              if (v) v.currentTime = Number(e.target.value);
              setTime(Number(e.target.value));
            }}
          />
          <div className="mt-1 flex items-center gap-1 md:gap-2">
            <ControlButton label={status === "playing" || status === "loading" ? "Pause" : "Play"} onClick={toggle}>
              {status === "playing" || status === "loading" ? <PauseIcon /> : <PlayIcon small />}
            </ControlButton>
            <ControlButton label={muted ? "Unmute" : "Mute"} onClick={() => videoRef.current && (videoRef.current.muted = !muted)}>
              {muted ? <MutedIcon /> : <SoundIcon />}
            </ControlButton>
            <p className="label ml-1 tabular-nums text-bone/80">
              {fmt(time)} <span className="text-dim">/ {fmt(length)}</span>
            </p>
            <span className="flex-1" />
            {canFullscreen && (
              <ControlButton label={isFullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={toggleFullscreen}>
                <FullscreenIcon exit={isFullscreen} />
              </ControlButton>
            )}
          </div>
        </div>
      )}

      <p className="sr-only" role="status">
        {status === "playing" ? "Playing" : status === "paused" ? "Paused" : status === "ended" ? "Ended" : ""}
      </p>
    </div>
  );
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex size-10 items-center justify-center text-bone/85 transition-colors hover:text-signal"
    >
      {children}
    </button>
  );
}

const PlayIcon = ({ small }: { small?: boolean }) => (
  <svg viewBox="0 0 24 24" className={small ? "size-4" : "ml-1 size-6"} fill="currentColor" aria-hidden>
    <path d="M7 4.5v15l12.5-7.5z" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
    <path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z" />
  </svg>
);
const ReplayIcon = () => (
  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" />
  </svg>
);
const SoundIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
  </svg>
);
const MutedIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l5 5M21 9.5l-5 5" />
  </svg>
);
const FullscreenIcon = ({ exit }: { exit?: boolean }) => (
  <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    {exit ? (
      <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
    ) : (
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    )}
  </svg>
);
