import { site, socialLinks } from "@/content/site";
import { publishedProjects } from "@/content/projects";
import { ClipReveal, Eyebrow, LineReveal, Reveal } from "./reveal";
import { VideoPlayer } from "./video-player";
import { WorkGrid } from "./work-grid";
import { ContactForm } from "./contact-form";
import { InquireButton, ProcessSteps } from "./sections-client";
import Image from "next/image";
import Link from "next/link";

/** Last word of a headline line, set in the orange italic serif. */
function Accent({ line }: { line: string }) {
  const words = line.split(" ");
  const last = words.pop()!;
  return (
    <>
      {words.join(" ")}{" "}
      <span className="font-serif normal-case italic tracking-normal text-signal">{last.toLowerCase()}</span>
    </>
  );
}

function accentLast(lines: readonly string[]) {
  return lines.map((line, i) => (i === lines.length - 1 ? <Accent key={i} line={line} /> : line));
}

export function ShowreelSection() {
  const reel = site.showreel;
  return (
    <section id="showreel" aria-labelledby="showreel-title" className="shell py-24 md:py-40">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Eyebrow index="01">{reel.label}</Eyebrow>
          <LineReveal
            id="showreel-title"
            lines={accentLast(reel.headline)}
            className="display mt-8 text-[clamp(2.8rem,7.5vw,8rem)] text-bone"
          />
        </div>
        <Reveal className="md:col-span-4 md:pb-3" delay={0.2}>
          <p className="max-w-sm text-bone/75">
            Twenty-one seconds of editing, motion and sound design — the fastest way to see how I work.
          </p>
          <p className="label mt-4 text-dim">
            {reel.title} · 16:9 · Sound on
          </p>
        </Reveal>
      </div>

      <ClipReveal className="corners mt-14 p-2 text-bone/25 md:mt-20 md:p-3">
        <VideoPlayer
          src={reel.src}
          poster={reel.poster}
          posterAlt="Frame from Anshuman Patel's 2026 showreel: a motocross rider pulling a wheelie across a desert, with tracking overlays"
          title={reel.title}
          duration={reel.duration}
        />
      </ClipReveal>
    </section>
  );
}

export function WorkSection() {
  return (
    <section id="work" aria-labelledby="work-title" className="shell py-24 md:py-36">
      <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Eyebrow index="02">Selected projects</Eyebrow>
          <LineReveal
            id="work-title"
            as="h2"
            lines={accentLast(["Work that", "moves."])}
            className="display mt-8 text-[clamp(2.8rem,7.5vw,8rem)] text-bone"
          />
        </div>
        <Reveal className="md:col-span-4 md:pb-3" delay={0.15}>
          <p className="max-w-sm text-bone/75">
            Brand films, kinetic typography, motion graphics and social edits — each with a short case study on how it was
            made.
          </p>
          <Link href="/work" className="label link-underline mt-5 inline-block text-bone">
            Full project index →
          </Link>
        </Reveal>
      </div>
      <WorkGrid projects={publishedProjects} />
    </section>
  );
}

export function AboutSection() {
  const about = site.about;
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line">
      <div className="shell grid gap-16 py-24 md:grid-cols-12 md:py-40">
        <div className="md:col-span-7">
          <Eyebrow index="03">About</Eyebrow>
          <LineReveal
            id="about-title"
            lines={accentLast(about.headline)}
            className="display mt-8 text-[clamp(2.8rem,6.1vw,6.75rem)] text-bone"
          />
          {about.portrait && (
            <ClipReveal className="relative mt-14 aspect-[4/5] max-w-md overflow-hidden bg-coal">
              <Image src={about.portrait.src} alt={about.portrait.alt} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" />
            </ClipReveal>
          )}
        </div>

        <div className="md:col-span-5 md:pt-24">
          <div className="space-y-6 text-lg leading-relaxed text-bone/80 md:text-xl">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? "text-bone" : undefined}>{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-14">
            <h3 className="label text-dim">Creative strengths</h3>
            <ul className="mt-5 border-t border-line">
              {about.strengths.map((s, i) => (
                <li key={s} className="flex items-baseline justify-between border-b border-line py-4">
                  <span className="text-lg text-bone">{s}</span>
                  <span className="label text-dim">{String(i + 1).padStart(2, "0")}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section id="services" aria-labelledby="services-title" className="border-t border-line bg-coal">
      <div className="shell py-24 md:py-40">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Eyebrow index="04">Services</Eyebrow>
            <LineReveal
            id="services-title"
              lines={accentLast(["What I can", "make for you."])}
              className="display mt-8 text-[clamp(2.8rem,7.2vw,7.5rem)] text-bone"
            />
          </div>
          <Reveal className="md:col-span-4 md:pb-3" delay={0.15}>
            <p className="max-w-sm text-bone/75">{site.pricing.note}</p>
            {site.pricing.startingAt && (
              <p className="label mt-4 text-bone">Projects from {site.pricing.startingAt}</p>
            )}
          </Reveal>
        </div>

        <ol className="mt-16 border-t border-line md:mt-24">
          {site.services.map((s, i) => (
            <li key={s.id} className="border-b border-line">
              <Reveal className="group grid gap-5 py-10 md:grid-cols-12 md:items-baseline md:gap-8 md:py-14" y={20}>
                <span className="label text-signal md:col-span-1">{String(i + 1).padStart(2, "0")} —</span>
                <h3 className="display text-[clamp(2rem,4.4vw,4.25rem)] text-bone transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:col-span-6 md:group-hover:translate-x-3">
                  {s.title}
                </h3>
                <p className="max-w-md text-bone/70 md:col-span-3">{s.body}</p>
                <div className="md:col-span-2 md:text-right">
                  <InquireButton type={s.inquiryType} service={s.title} />
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section aria-labelledby="process-title" className="border-t border-line">
      <div className="shell py-24 md:py-40">
        <Eyebrow index="05">Creative process</Eyebrow>
        <LineReveal
            id="process-title"
          lines={accentLast(["From brief", "to final frame."])}
          className="display mt-8 text-[clamp(2.8rem,7.2vw,7.5rem)] text-bone"
        />
        <ProcessSteps steps={site.process} />
      </div>
    </section>
  );
}

export function ContactSection() {
  const c = site.contact;
  const links = socialLinks();
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative border-t border-line">
      <div className="shell grid gap-16 py-24 md:grid-cols-12 md:py-40">
        <div className="md:col-span-6">
          <Eyebrow index="06">Contact</Eyebrow>
          <LineReveal
            id="contact-title"
            lines={accentLast(c.headline)}
            className="display mt-8 text-[clamp(2.8rem,5.3vw,6rem)] text-bone"
          />
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-md text-lg leading-relaxed text-bone/80">{c.intro}</p>
          </Reveal>

          <Reveal delay={0.15} className="mt-14 space-y-8">
            <div>
              <p className="label text-dim">Email</p>
              <a
                href={`mailto:${site.social.email}`}
                className="link-underline mt-2 inline-block break-all text-2xl text-bone md:text-3xl"
              >
                {site.social.email}
              </a>
            </div>
            <div>
              <p className="label text-dim">Follow the work</p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {links
                  .filter((l) => l.key !== "email")
                  .map((l) => (
                    <li key={l.key}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-bone/85 hover:text-bone"
                      >
                        {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal className="md:col-span-6 md:pt-20" delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
