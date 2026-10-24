"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/content/projects";
import { FilterBar, filterProjects, type Filter } from "./filter-bar";
import { ProjectTile } from "./project-tile";

const WIDE = "(min-width: 1024px) 60vw, (min-width: 768px) 48vw, 100vw";
const NARROW = "(min-width: 1024px) 34vw, (min-width: 768px) 48vw, 100vw";

/**
 * Phones: one full-width column. Tablets: two columns with the right one
 * dropped lower for a staggered rhythm. Large screens: an editorial 12-column
 * grid laid out in pairs, with spans and offsets chosen by each pair's mix of
 * 16:9 and 9:16 work.
 */
function layout(items: Project[]) {
  const out: { cls: string; sizes: string }[] = [];
  const tall = (p: Project) => p.format === "9:16";
  const sizes = (cls: string) => (/span-[78]/.test(cls) ? WIDE : NARROW);
  for (let i = 0; i < items.length; i += 2) {
    const a = items[i];
    const b = items[i + 1];
    const flip = (i / 2) % 2 === 1;
    let pair: [string, string];
    if (!b) pair = [tall(a) ? "lg:col-span-4 lg:col-start-5" : "lg:col-span-8 lg:col-start-3", ""];
    else if (!tall(a) && !tall(b))
      pair = flip ? ["lg:col-span-5 lg:mt-40", "lg:col-span-7 lg:mt-0"] : ["lg:col-span-7", "lg:col-span-5 lg:mt-48"];
    else if (!tall(a)) pair = ["lg:col-span-8", "lg:col-span-4 lg:mt-36"];
    else if (!tall(b)) pair = ["lg:col-span-4", "lg:col-span-8 lg:mt-56"];
    else pair = ["lg:col-span-4 lg:col-start-2", "lg:col-span-4 lg:col-start-8 lg:mt-40"];
    out.push({ cls: pair[0], sizes: sizes(pair[0]) });
    // The second card of each pair sits lower on tablets.
    if (b) out.push({ cls: `md:mt-28 ${pair[1]}`, sizes: sizes(pair[1]) });
  }
  return out;
}

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = filterProjects(projects, filter);
  const slots = layout(visible);

  return (
    <div>
      <FilterBar projects={projects} value={filter} onChange={setFilter} />
      <ul className="mt-10 grid grid-cols-1 gap-x-[clamp(1.25rem,3vw,3.5rem)] gap-y-14 md:mt-14 md:grid-cols-2 md:gap-y-20 lg:mt-16 lg:grid-cols-12 lg:gap-y-28">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => (
            <motion.li
              key={p.slug}
              layout="position"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`min-w-0 ${slots[i].cls}`}
            >
              <ProjectTile project={p} index={projects.indexOf(p)} sizes={slots[i].sizes} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
