"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content/site";

/**
 * Phones and tablets only: a compact "Let's talk" bar that slides up once the
 * visitor is past the first screen, and steps aside when the contact section
 * or the footer is on screen.
 */
export function FloatingCta() {
  const [past, setPast] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const targets = [document.getElementById("contact"), document.querySelector("footer")].filter(Boolean) as Element[];
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setBlocked(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const show = past && !blocked;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
        >
          <div className="flex items-center gap-1.5 rounded-full border border-line bg-ink/80 p-1.5 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.9)] backdrop-blur-md">
            <Link
              href="/#contact"
              className="label flex items-center gap-2.5 rounded-full bg-signal px-5 py-3 text-ink transition-transform active:scale-95"
            >
              <span className="size-1.5 rounded-full bg-ink" aria-hidden />
              Let&apos;s talk
            </Link>
            {site.social.whatsapp && (
              <a
                href={site.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="label rounded-full px-4 py-3 text-bone transition-colors active:bg-bone/10"
              >
                WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {site.social.phone && (
              <a
                href={`tel:+${site.social.phone}`}
                className="label rounded-full px-4 py-3 text-bone transition-colors active:bg-bone/10"
              >
                Call
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
