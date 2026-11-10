import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/content/projects";
import { ClipReveal, Eyebrow, LineReveal, Reveal } from "./reveal";
import { LoopVideo } from "./loop-video";

/**
 * Home-page showcase for 3D work. The lead piece (preferably one with a
 * scroll-driven sequence) plays as a full-width loop; any other 3D projects
 * follow as compact links.
 */
export function ThreeDSection({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  const lead = projects.find((p) => p.scrollSequence) ?? projects[0];
  const rest = projects.filter((p) => p !== lead);
  const phases = lead.scrollSequence?.phases ?? [];

  return (
    <section id="three-d" aria-labelledby="three-d-title" className="border-t border-line bg-[#05080d]">
      <div className="shell py-20 md:py-32 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow index="✦">3D Animation · {lead.tools.length ? lead.tools.join(" · ") : "CGI"}</Eyebrow>
            <LineReveal
              id="three-d-title"
              lines={[
                "Into the third",
                <span key="b">
                  <span className="font-serif normal-case italic tracking-normal text-[#5eead4]">dimension.</span>
                </span>,
              ]}
              className="display mt-6 text-[clamp(2.8rem,11vw,8rem)] text-bone md:mt-8 lg:text-[clamp(2.8rem,7.5vw,8rem)]"
            />
          </div>
          <Reveal className="lg:col-span-4 lg:pb-3" delay={0.15}>
            <p className="max-w-sm text-bone/75">
              Procedural 3D built, lit and rendered from scratch — designed to play as a film or to be driven frame by
              frame by the visitor&apos;s scroll.
            </p>
          </Reveal>
        </div>

        <ClipReveal className="mt-12 md:mt-16">
          <Link href={`/work/${lead.slug}`} data-cursor="Explore" className="group relative block overflow-hidden">
            <div className="relative aspect-[4/3] bg-[#05080d] sm:aspect-video">
              <LoopVideo
                src={lead.media.film}
                poster={lead.media.poster}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05080d] via-[#05080d]/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 p-5 md:p-8">
                <div>
                  <p className="label text-[#5eead4]">{lead.context}</p>
                  <h3 className="display mt-3 text-[clamp(2.4rem,7vw,5.5rem)] text-bone">{lead.title}</h3>
                  <p className="mt-2 max-w-md text-bone/75">{lead.subtitle}</p>
                </div>
                <span className="label inline-flex items-center gap-3 bg-bone px-5 py-3.5 text-ink transition-colors group-hover:bg-[#5eead4]">
                  {lead.scrollSequence ? "Scroll through it" : "View project"} <span aria-hidden>→</span>
                </span>
              </div>
            </div>
          </Link>
        </ClipReveal>

        {phases.length > 0 && (
          <ol className="mt-8 grid grid-cols-2 border-t border-line md:grid-cols-4">
            {phases.map((ph, i) => (
              <Reveal key={ph.label} delay={i * 0.06} className="border-b border-line py-5 pr-4 md:border-b-0 md:py-7">
                <li>
                  <p className="label text-[#5eead4]">{ph.label}</p>
                  <p className="mt-2 text-bone">{ph.title}</p>
                  <p className="label mt-2 text-dim">
                    Frames {i === 0 ? 1 : phases[i - 1].end}–{ph.end}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        )}

        {rest.length > 0 && (
          <div className="mt-14 md:mt-20">
            <p className="label text-dim">More 3D work</p>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="group flex items-center gap-4 border border-line p-3 transition-colors hover:border-bone/40">
                    <span className="relative aspect-video w-28 shrink-0 overflow-hidden bg-ink">
                      <Image src={p.media.poster} alt="" fill sizes="112px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-xl uppercase text-bone group-hover:text-[#5eead4]">{p.title}</span>
                      <span className="label mt-1 block text-dim">{p.context}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
