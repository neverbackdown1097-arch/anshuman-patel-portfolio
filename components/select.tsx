"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  id: string;
  name: string;
  value: string;
  options: readonly string[];
  placeholder: string;
  /** Adds an empty choice at the top (for optional fields). */
  emptyLabel?: string;
  invalid?: boolean;
  describedBy?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

/**
 * Dark, on-brand dropdown (WAI-ARIA select-only combobox). Keyboard:
 * ↑/↓ move, Enter/Space choose, Home/End jump, Esc closes, typing jumps to
 * a matching option. Closes on outside click.
 */
export function Select({ id, name, value, options, placeholder, emptyLabel, invalid, describedBy, onChange, onBlur }: Props) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const choices = emptyLabel !== undefined ? ["", ...options] : [...options];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const labelFor = (v: string) => (v === "" ? (emptyLabel ?? placeholder) : v);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, choices.indexOf(value)));
    setOpen(true);
  };

  const choose = (i: number) => {
    onChange(choices[i]);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = choices.length - 1;
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList();
      return;
    }
    if (!open) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(last, a + 1));
        return;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        return;
      case "Home":
        e.preventDefault();
        setActive(0);
        return;
      case "End":
        e.preventDefault();
        setActive(last);
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        return;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        return;
      case "Tab":
        setOpen(false);
        return;
    }
    if (e.key.length === 1) {
      const now = Date.now();
      typed.current.text = (now - typed.current.at > 700 ? "" : typed.current.text) + e.key.toLowerCase();
      typed.current.at = now;
      const hit = choices.findIndex((c) => labelFor(c).toLowerCase().startsWith(typed.current.text));
      if (hit >= 0) setActive(hit);
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        id={id}
        name={name}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        onBlur={(e) => {
          if (!wrapRef.current?.contains(e.relatedTarget as Node)) onBlur?.();
        }}
        className={`flex w-full items-center justify-between gap-3 border-0 border-b bg-transparent py-3 text-left text-lg transition-colors duration-300 focus:outline-none focus-visible:outline-none ${
          open ? "border-signal" : invalid ? "border-signal" : "border-line hover:border-bone/40 focus:border-signal"
        } ${value ? "text-bone" : "text-dim"}`}
      >
        <span className="truncate">{value ? value : placeholder}</span>
        <svg
          viewBox="0 0 12 8"
          aria-hidden
          className={`size-3 shrink-0 text-bone/70 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M1 1.5l5 5 5-5" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-labelledby={id}
            initial={{ opacity: 0, y: -6, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-auto border border-bone/15 bg-graphite py-2 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.9)]"
          >
            {choices.map((c, i) => {
              const selected = c === value;
              return (
                <li
                  key={c || "__empty"}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActive(i)}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => choose(i)}
                  className={`flex cursor-pointer items-center justify-between gap-4 px-4 py-3 text-base transition-colors ${
                    i === active ? "bg-bone/[0.07] text-bone" : "text-bone/75"
                  } ${c === "" ? "text-mute" : ""}`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className={`h-px transition-all duration-300 ${i === active ? "w-4 bg-signal" : "w-0 bg-transparent"}`}
                    />
                    {labelFor(c)}
                  </span>
                  {selected && (
                    <span aria-hidden className="text-signal">
                      ✓
                    </span>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
