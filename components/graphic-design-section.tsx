import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/content/projects";
import { site } from "@/content/site";
import { ClipReveal, Eyebrow, LineReveal, Reveal } from "./reveal";
import { isVertical } from "@/lib/format";
import { CurrencyProvider, Money } from "./currency";

/**
 * Home-page showcase for still graphic design (posters, web heroes). Each
 * design gets a large editorial card; the disciplines and a link to the
 * design rates follow.
 */
export function GraphicDesignSection({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  const tall = projects.filter((p) => isVertical(p.format));
  const wide = projects.filter((p) => !isVertical(p.format));
  // Two designs: a portrait/landscape editorial split. Three or more: a
  // staggered row of 4:5 cards, newest first.
  const grid = projects.length >= 3;
  const four = projects.length % 4 === 0;
  const ordered = grid ? projects : [...tall, ...wide];

  return (
    <section id="graphic-design" aria-labelledby="graphic-design-title" className="border-t border-line">
      <div className="shell py-20 md:py-32 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow index="✦">Graphic design · Photoshop</Eyebrow>
            <LineReveal
              id="graphic-design-title"
              as="h2"
              lines={[
                "Still frames,",
                <span key="b">
                  <span className="font-serif normal-case italic tracking-normal text-signal">strong ideas.</span>
                </span>,
              ]}
              className="display mt-6 text-[clamp(2.8rem,11vw,8rem)] text-bone md:mt-8 lg:text-[clamp(2.8rem,7.5vw,8rem)]"
            />
          </div>
          <Reveal className="lg:col-span-4 lg:pb-3" delay={0.15}>
            <p className="max-w-sm text-bone/75">
              Posters, key visuals and web design built in Photoshop — the same eye for composition, light and type that
              drives my films, held in a single frame.
            </p>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-6 lg:gap-8">
          {ordered.map((p, i) => {
            const portrait = isVertical(p.format);
            const span = grid
              ? four
                ? `md:col-span-6 lg:col-span-3 ${i % 2 === 1 ? "lg:mt-20" : ""}`
                : `md:col-span-6 lg:col-span-4 ${i % 3 === 1 ? "lg:mt-24" : i % 3 === 2 ? "lg:mt-12" : ""}`
              : ordered.length === 1
                ? "md:col-span-8 md:col-start-3"
                : portrait
                  ? "md:col-span-5"
                  : "md:col-span-7 md:mt-24";
            return (
              <li key={p.slug} className={span}>
                <Link href={`/work/${p.slug}`} data-cursor="View" className="group block">
                  <ClipReveal
                    className={`relative overflow-hidden bg-coal ${portrait || grid ? "aspect-[4/5]" : "aspect-[4/3]"}`}
                    delay={i * 0.1}
                  >
                    <Image
                      src={p.media.poster}
                      alt={p.media.posterAlt}
                      fill
                      sizes={grid ? (four ? "(min-width: 1024px) 24vw, (min-width: 768px) 48vw, 100vw" : "(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 100vw") : portrait ? "(min-width: 768px) 40vw, 100vw" : "(min-width: 768px) 56vw, 100vw"}
                      className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                    />
                  </ClipReveal>
                  <div className="mt-5 flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <p className="label text-dim">{p.categories[0]}</p>
                      <h3 className={`display mt-2 text-bone ${grid ? (four ? "text-[clamp(1.6rem,2vw,2rem)]" : "text-[clamp(1.7rem,2.6vw,2.4rem)]") : "text-[clamp(1.9rem,4vw,2.9rem)]"} transition-colors group-hover:text-signal`}>
                        {p.title}
                      </h3>
                      <p className="mt-2 max-w-md text-bone/70">{p.subtitle}</p>
                    </div>
                    <span aria-hidden className="label mt-1 shrink-0 text-bone/70 transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-16 grid gap-10 border-t border-line pt-10 md:mt-24 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-8">
            <h3 className="label text-dim">What I design</h3>
            <CurrencyProvider rate={site.pricing.inrRate}>
            <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
              {site.designServices.map((s) => (
                <li key={s.id} className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                  <span className="text-lg text-bone">{s.title}</span>
                  <span className="label shrink-0 text-dim">
                    From <Money usd={s.price} />
                  </span>
                </li>
              ))}
            </ul>
            </CurrencyProvider>
          </Reveal>
          <Reveal className="flex flex-col items-start gap-4 lg:col-span-3 lg:col-start-10 lg:items-end lg:justify-end" delay={0.1}>
            <Link href="/#design-rates" className="label inline-flex items-center gap-3 bg-bone px-5 py-3.5 text-ink transition-colors hover:bg-signal">
              See design rates <span aria-hidden>→</span>
            </Link>
            <Link href="/work" className="label link-underline text-bone/85">
              All work →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
