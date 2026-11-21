"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * USD ⇄ INR price switch. Prices are stored in USD; INR is converted at a
 * fixed rate from content/site.ts and rounded to a clean figure. Visitors in
 * India (by time zone) see INR first; a manual choice is remembered.
 */
type Currency = "USD" | "INR";

const Ctx = createContext<{ cur: Currency; set: (c: Currency) => void; rate: number }>({
  cur: "USD",
  set: () => {},
  rate: 88,
});

const KEY = "ap-currency";

export function CurrencyProvider({ rate, children }: { rate: number; children: ReactNode }) {
  const [cur, setCur] = useState<Currency>("USD");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    if (saved === "USD" || saved === "INR") return setCur(saved);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") setCur("INR");
  }, []);

  const set = (c: Currency) => {
    setCur(c);
    try {
      localStorage.setItem(KEY, c);
    } catch {}
  };

  return <Ctx.Provider value={{ cur, set, rate }}>{children}</Ctx.Provider>;
}

/** Round INR to a figure a person would actually quote. */
function roundInr(n: number) {
  const step = n >= 100000 ? 5000 : n >= 20000 ? 1000 : n >= 2000 ? 500 : 100;
  return Math.round(n / step) * step;
}

export function formatPrice(usd: number, cur: Currency, rate: number) {
  return cur === "USD"
    ? `$${usd.toLocaleString("en-US")}`
    : `₹${roundInr(usd * rate).toLocaleString("en-IN")}`;
}

export function Money({ usd }: { usd: number }) {
  const { cur, rate } = useContext(Ctx);
  return <span className="tabular-nums">{formatPrice(usd, cur, rate)}</span>;
}

export function CurrencyToggle() {
  const { cur, set, rate } = useContext(Ctx);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div role="radiogroup" aria-label="Show prices in" className="inline-flex rounded-full border border-line p-1">
        {(["USD", "INR"] as const).map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={cur === c}
            onClick={() => set(c)}
            className={`label rounded-full px-4 py-2 transition-colors duration-300 ${
              cur === c ? "bg-bone text-ink" : "text-bone/70 hover:text-bone"
            }`}
          >
            {c === "USD" ? "$ USD" : "₹ INR"}
          </button>
        ))}
      </div>
      <p className="label text-dim" aria-live="polite">
        {cur === "INR" ? `Converted at $1 = ₹${rate} · rounded` : "Prices in US dollars"}
      </p>
    </div>
  );
}
