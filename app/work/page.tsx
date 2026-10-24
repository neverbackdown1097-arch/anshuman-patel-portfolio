import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { publishedProjects } from "@/content/projects";
import { WorkIndex } from "@/components/work-index";
import { Eyebrow, LineReveal, Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Work — Video Editing & Motion Design Portfolio",
  description: `Every project by ${site.name}: cinematic brand films, kinetic typography, motion graphics and social media videos, each with a case study.`,
  alternates: { canonical: "/work" },
  openGraph: { url: "/work", title: `Work — ${site.name}` },
};

export default function WorkPage() {
  return (
    <div className="shell pb-28 pt-[calc(var(--nav-h)+4rem)] md:pb-40 md:pt-[calc(var(--nav-h)+7rem)]">
      <Eyebrow index={String(publishedProjects.length).padStart(2, "0")}>Project index</Eyebrow>
      <LineReveal
        as="h1"
        immediate
        lines={["All work."]}
        className="display mt-8 text-[clamp(4rem,14vw,13rem)] text-bone"
      />
      <Reveal delay={0.3}>
        <p className="mt-8 max-w-xl text-lg text-bone/75">
          Brand films, motion graphics, kinetic typography and social edits by {site.name}. Choose any project to see the
          film and how it was made.
        </p>
      </Reveal>
      <div className="mt-16 md:mt-24">
        <WorkIndex projects={publishedProjects} />
      </div>
      <Reveal className="mt-20 flex flex-wrap items-center justify-between gap-6">
        <p className="font-serif text-3xl italic text-bone/90 md:text-4xl">Have something in mind?</p>
        <Link href="/#contact" className="label bg-bone px-6 py-4 text-ink transition-colors hover:bg-signal">
          Let&apos;s work together ↗
        </Link>
      </Reveal>
    </div>
  );
}
