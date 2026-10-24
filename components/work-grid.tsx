"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/content/projects";
import { FilterBar, filterProjects, type Filter } from "./filter-bar";
import { ProjectTile } from "./project-tile";

const WIDE = "(min-width: 768px) 60vw, 100vw";
const NARROW = "(min-width: 768px) 34vw, 75vw";

/**
 * Editorial gallery: projects are laid out in pairs on a 12-column grid,
 * with spans and vertical offsets chosen by the pair's mix of 16:9 and 9:16.
 */
function layout(items: Project[]) {
  const out: { cls: string; sizes: string }[] = [];
  const tall = (p: Project) => p.format === "9:16";
  // On phones, tall cards take three quarters of the width and alternate sides.
  const phoneTall = (left: boolean) => `w-3/4 md:w-auto ${left ? "" : "ml-auto md:ml-0"}`;
  for (let i = 0; i < items.length; i += 2) {
    const a = items[i];
    const b = items[i + 1];
    const flip = (i / 2) % 2 === 1;
    if (!b) {
      out.push(
        tall(a)
          ? { cls: `${phoneTall(true)} md:col-span-4 md:col-start-5`, sizes: NARROW }
          : { cls: "md:col-span-8 md:col-start-3", sizes: WIDE },
      );
    } else if (!tall(a) && !tall(b)) {
      out.push(
        { cls: flip ? "md:col-span-5 md:mt-40" : "md:col-span-7", sizes: flip ? NARROW : WIDE },
        { cls: flip ? "md:col-span-7" : "md:col-span-5 md:mt-48", sizes: flip ? WIDE : NARROW },
      );
    } else if (!tall(a)) {
      out.push({ cls: "md:col-span-8", sizes: WIDE }, { cls: `${phoneTall(false)} md:col-span-4 md:mt-36`, sizes: NARROW });
    } else if (!tall(b)) {
      out.push({ cls: `${phoneTall(true)} md:col-span-4`, sizes: NARROW }, { cls: "md:col-span-8 md:mt-56", sizes: WIDE });
    } else {
      out.push(
        { cls: `${phoneTall(true)} md:col-span-4 md:col-start-2`, sizes: NARROW },
        { cls: `${phoneTall(false)} md:col-span-4 md:col-start-8 md:mt-40`, sizes: NARROW },
      );
    }
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
      <ul className="mt-12 grid grid-cols-1 gap-x-[clamp(1.25rem,3vw,3.5rem)] gap-y-16 md:mt-16 md:grid-cols-12 md:gap-y-28">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => (
            <motion.li
              key={p.slug}
              layout="position"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={slots[i].cls}
            >
              <ProjectTile project={p} index={projects.indexOf(p)} sizes={slots[i].sizes} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
