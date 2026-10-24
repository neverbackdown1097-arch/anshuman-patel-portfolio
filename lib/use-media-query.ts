"use client";

import { useSyncExternalStore } from "react";

/** Live result of a CSS media query. Always `false` during server rendering. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const noop = () => () => {};

/** True once the component is running in the browser (after hydration). */
export function useIsClient() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
