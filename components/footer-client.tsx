"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Current year, read on the client so the static page never goes stale. */
export function Year() {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => null,
  );
  return <span suppressHydrationWarning>{year ?? ""}</span>;
}

export function BackToTop() {
  return (
    <button
      type="button"
      className="label group flex items-center gap-3 self-start text-mute hover:text-bone sm:self-auto"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.querySelector<HTMLElement>("#main")?.focus({ preventScroll: true });
      }}
    >
      Back to top
      <span aria-hidden className="transition-transform duration-500 group-hover:-translate-y-1">
        ↑
      </span>
    </button>
  );
}
