"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { formatDuration, type Project } from "@/content/projects";
import { FilterBar, filterProjects, type Filter } from "./filter-bar";

/**
 * Studio-style project index. Rows are plain links; on fine pointers a
 * poster floats beside the cursor, on touch a thumbnail sits in the row.
 */
export function WorkIndex({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [hovered, setHovered] = useState<Project | null>(null);
  const visible = filterProjects(projects, filter);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 35 });
  const sy = useSpring(y, { stiffness: 300, damping: 35 });

  return (
    <div
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
    >
      <FilterBar projects={projects} value={filter} onChange={setFilter} />

      <div className="label mt-14 hidden grid-cols-12 gap-6 border-b border-line pb-3 text-dim md:grid" aria-hidden>
        <span className="col-span-1">No.</span>
        <span className="col-span-5">Project</span>
        <span className="col-span-3">Discipline</span>
        <span className="col-span-2">Format</span>
        <span className="col-span-1 text-right">Year</span>
      </div>

      <ul className="mt-8 border-t border-line md:mt-0 md:border-t-0">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((p) => (
            <motion.li
              key={p.slug}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="border-b border-line"
            >
              <Link
                href={`/work/${p.slug}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(p)}
                onPointerLeave={() => setHovered(null)}
                className="group grid grid-cols-[5.5rem_1fr] items-center gap-x-5 gap-y-1 py-5 md:grid-cols-12 md:gap-6 md:py-7"
              >
                <span className="relative row-span-3 aspect-[4/5] overflow-hidden bg-coal md:hidden">
                  <Image src={p.media.poster} alt="" fill sizes="88px" className="object-cover" />
                </span>
                <span className="label hidden text-dim md:col-span-1 md:block">
                  {String(projects.indexOf(p) + 1).padStart(2, "0")}
                </span>
                <span className="md:col-span-5">
                  <span className="display block text-[clamp(1.6rem,3.4vw,3.25rem)] leading-none text-bone transition-[color,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-2 group-hover:text-signal">
                    {p.title}
                  </span>
                  <span className="mt-1.5 block text-sm text-mute">{p.brand ?? p.context}</span>
                </span>
                <span className="label text-mute md:col-span-3">{p.categories.slice(0, 2).join(" · ")}</span>
                <span className="label text-dim md:col-span-2">
                  {p.format} · {formatDuration(p.duration)}
                </span>
                <span className="label hidden text-right text-dim md:col-span-1 md:block">{p.date.slice(0, 4)}</span>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Floating poster (decorative; the row link carries the information). */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
        style={{ x: sx, y: sy }}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered.slug}
              className={`relative ml-8 -translate-y-1/2 overflow-hidden ${hovered.format === "9:16" ? "h-[22rem] w-[12.4rem]" : "h-[13.5rem] w-[24rem]"}`}
              initial={{ opacity: 0, scale: 0.92, clipPath: "inset(15% 15% 15% 15%)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={hovered.media.poster} alt="" fill sizes="400px" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
