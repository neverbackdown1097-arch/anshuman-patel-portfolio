import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import {
  formatDuration,
  getProject,
  isoDuration,
  nextProject,
  projects,
  storySections,
  type Project,
  type Still,
} from "@/content/projects";
import { VideoPlayer } from "@/components/video-player";
import { ClipReveal, Eyebrow, LineReveal, Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { EditRoom } from "@/components/edit-room";
import { aspectClass, frameSize } from "@/lib/format";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const abs = (path: string) => (path.startsWith("http") ? path : `${site.url}${path}`);

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.title} — ${p.categories[0]} Case Study`;
  return {
    title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    robots: p.placeholder ? { index: false } : undefined,
    openGraph: {
      type: "video.other",
      url: `/work/${p.slug}`,
      title: `${p.title} | ${site.name}`,
      description: p.summary,
      images: [{ url: p.media.poster, ...frameSize[p.format], alt: p.media.posterAlt }],
    },
    twitter: { card: "summary_large_image", title: `${p.title} | ${site.name}`, description: p.summary, images: [p.media.poster] },
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const index = projects.indexOf(p);
  const next = nextProject(p.slug);
  const vertical = p.format === "9:16";
  const sections = storySections.filter((s) => p.story[s.key]);
  const stills = p.media.stills;
  // Stills are woven between the story sections so the page stays visual-first.
  const breaks: Record<number, Still[]> = vertical
    ? { 1: stills.slice(0, 2), 3: stills.slice(2, 4) }
    : { 1: stills.slice(0, 1), 3: stills.slice(1, 3), 5: stills.slice(3, 4) };
  const lastBreak = Math.max(...Object.keys(breaks).map(Number));
  const leftover = Object.entries(breaks)
    .filter(([k]) => Number(k) >= sections.length && Number(k) <= lastBreak)
    .flatMap(([, v]) => v);

  const meta = [
    { k: p.brand ? "Brand" : "Context", v: p.brand ?? p.context },
    { k: "Year", v: p.date.slice(0, 4) },
    { k: "Format", v: `${p.format} · ${formatDuration(p.duration)}` },
    { k: "Discipline", v: p.categories.join(", ") },
  ];

  return (
    <article>
      {!p.placeholder && (
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: p.title,
              description: p.summary,
              thumbnailUrl: [abs(p.media.poster)],
              uploadDate: p.date,
              duration: isoDuration(p.duration),
              contentUrl: abs(p.media.film),
              creator: { "@type": "Person", name: site.name, url: site.url },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: site.url },
                { "@type": "ListItem", position: 2, name: "Work", item: `${site.url}/work` },
                { "@type": "ListItem", position: 3, name: p.title, item: `${site.url}/work/${p.slug}` },
              ],
            },
          ]}
        />
      )}

      {/* Title block */}
      <header className="shell pt-[calc(var(--nav-h)+3rem)] md:pt-[calc(var(--nav-h)+6rem)]">
        <nav aria-label="Breadcrumb" className="label flex items-center gap-3 text-mute">
          <Link href="/work" className="link-underline hover:text-bone">
            ← All work
          </Link>
          <span aria-hidden className="text-dim">/</span>
          <span aria-current="page" className="text-dim">
            Project {String(index + 1).padStart(2, "0")} of {String(projects.length).padStart(2, "0")}
          </span>
        </nav>

        {p.placeholder && (
          <p className="label mt-8 inline-block bg-signal px-2 py-1 text-ink">Placeholder project — not real client work</p>
        )}

        <LineReveal
          as="h1"
          immediate
          delay={0.1}
          lines={[p.title]}
          className="display mt-10 max-w-[18ch] text-[clamp(3.2rem,9.5vw,10rem)] text-bone"
        />
        <Reveal delay={0.35}>
          <p className="mt-6 font-serif text-3xl italic text-signal md:text-4xl">{p.subtitle}</p>
        </Reveal>

        <Reveal delay={0.45}>
          <dl className="mt-14 grid grid-cols-2 gap-y-8 border-t border-line pt-6 md:grid-cols-4">
            {meta.map((m) => (
              <div key={m.k} className="pr-4">
                <dt className="label text-dim">{m.k}</dt>
                <dd className="mt-2 text-bone/90">{m.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </header>

      {/* The film */}
      <section aria-label="Final film" className="shell mt-14 md:mt-20">
        <Reveal delay={0.5}>
          <div className={vertical ? "md:mx-auto md:max-w-[42rem]" : ""}>
            <VideoPlayer
              src={p.media.film}
              poster={p.media.poster}
              posterAlt={p.media.posterAlt}
              title={p.title}
              format={p.format}
              duration={p.duration}
              preload
            />
          </div>
          <p className="label mt-4 text-center text-dim">Final film · sound on · press F for fullscreen</p>
        </Reveal>
      </section>

      {p.breakdown && <EditRoom b={p.breakdown} title={p.title} />}

      {/* Story, interleaved with stills */}
      <div className="shell mt-24 md:mt-40">
        {sections.map((s, i) => (
          <div key={s.key}>
            <section aria-labelledby={`sec-${s.key}`} className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-8 md:py-20">
              <Reveal className="md:col-span-4">
                <Eyebrow index={String(i + 1).padStart(2, "0")}>
                  <span id={`sec-${s.key}`}>{s.label}</span>
                </Eyebrow>
              </Reveal>
              <Reveal className="md:col-span-7 md:col-start-6" delay={0.08}>
                <p className={i === 0 ? "text-2xl leading-snug text-bone md:text-4xl" : "text-xl leading-relaxed text-bone/80 md:text-2xl"}>
                  {p.story[s.key]}
                </p>
              </Reveal>
            </section>
            {breaks[i] && <Stills stills={breaks[i]} all={stills} format={p.format} />}
          </div>
        ))}
        {leftover.length > 0 && <Stills stills={leftover} all={stills} format={p.format} />}
      </div>

      <Credits project={p} />

      <NextProject project={next} />
    </article>
  );
}

function Stills({ stills, all, format }: { stills: Still[]; all: Still[]; format: Project["format"] }) {
  const vertical = format === "9:16";
  if (!stills.length) return null;
  const single = stills.length === 1;
  return (
    <div
      className={`mb-12 grid gap-4 md:mb-20 md:gap-6 ${
        vertical ? "grid-cols-2 md:mx-auto md:max-w-4xl" : single ? "" : "md:grid-cols-12"
      }`}
    >
      {stills.map((s, i) => (
        <figure
          key={s.src}
          className={vertical ? (i === 1 ? "mt-16 md:mt-28" : "") : single ? "" : i === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-32"}
        >
          <ClipReveal className={`relative overflow-hidden bg-coal ${aspectClass[format]}`} delay={i * 0.1}>
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes={vertical ? "(min-width: 768px) 28rem, 50vw" : single ? "(min-width: 1280px) 90vw, 100vw" : "(min-width: 768px) 55vw, 100vw"}
              className="object-cover"
            />
          </ClipReveal>
          <figcaption className="label mt-3 text-dim">
            Still {String(all.indexOf(s) + 1).padStart(2, "0")} / {String(all.length).padStart(2, "0")}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function Credits({ project: p }: { project: Project }) {
  const rows = [
    { k: "Role & contribution", v: p.role },
    { k: "Tools", v: p.tools },
    { k: "Credits", v: p.credits },
  ].filter((r) => r.v.length);
  return (
    <section aria-label="Credits" className="shell mt-8">
      <Reveal>
        <dl className="grid gap-10 border-t border-line py-12 md:grid-cols-12 md:py-16">
          {rows.map((r, i) => (
            <div key={r.k} className={i === 0 ? "md:col-span-4" : "md:col-span-4"}>
              <dt className="label text-dim">{r.k}</dt>
              <dd className="mt-4">
                <ul className="space-y-2 text-bone/85">
                  {r.v.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

function NextProject({ project: n }: { project: Project }) {
  return (
    <section aria-label="Next project" className="mt-12 border-t border-line">
      <Link href={`/work/${n.slug}`} data-cursor="Next" className="group relative block overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={n.media.poster}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-35 transition-[transform,opacity] duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105 group-hover:opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
        </div>
        <div className="shell relative py-28 md:py-44">
          <p className="label text-mute">Next project →</p>
          <p className="display mt-6 max-w-[16ch] text-[clamp(3rem,9vw,9rem)] text-bone transition-colors duration-500 group-hover:text-signal">
            {n.title}
          </p>
          <p className="label mt-6 text-bone/70">{n.categories.join(" · ")}</p>
        </div>
      </Link>
    </section>
  );
}
