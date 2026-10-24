"use client";

import { categories, type Category, type Project } from "@/content/projects";

export type Filter = Category | "All";

export function filterProjects(projects: Project[], filter: Filter) {
  return filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));
}

/** Category chips with counts. Categories without projects are hidden. */
export function FilterBar({
  projects,
  value,
  onChange,
}: {
  projects: Project[];
  value: Filter;
  onChange: (f: Filter) => void;
}) {
  const count = (f: Filter) => (f === "All" ? projects.length : projects.filter((p) => p.categories.includes(f)).length);
  const options = (["All", ...categories] as Filter[]).filter((f) => count(f) > 0);
  const shown = count(value);

  return (
    <>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {options.map((f) => {
          const active = f === value;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(f)}
              className={`label rounded-full border px-4 py-2.5 transition-colors duration-300 ${
                active ? "border-bone bg-bone text-ink" : "border-line text-bone/75 hover:border-bone/50 hover:text-bone"
              }`}
            >
              {f}
              <sup className={`ml-1 ${active ? "text-ink/60" : "text-dim"}`}>{count(f)}</sup>
            </button>
          );
        })}
      </div>
      <p className="sr-only" role="status">
        Showing {shown} {shown === 1 ? "project" : "projects"}
        {value === "All" ? "" : ` in ${value}`}
      </p>
    </>
  );
}
