import { site, socialLinks } from "@/content/site";
import { publishedProjects } from "@/content/projects";
import { ClipReveal, Eyebrow, LineReveal, Reveal } from "./reveal";
import { VideoPlayer } from "./video-player";
import { WorkGrid } from "./work-grid";
import { ContactForm } from "./contact-form";
import { ContactDirect, InquireButton, ProcessSteps, ScrollMarquee } from "./sections-client";
import Image from "next/image";
import Link from "next/link";

/*
 * Breakpoints: phones get a single column, tablets (md) a calmer two-column
 * rhythm, and the asymmetric 12-column editorial grid starts at lg (1024px).
 */

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
    <section id="showreel" aria-labelledby="showreel-title" className="shell py-20 md:py-32 lg:py-40">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-8">
          <Eyebrow index="01">{reel.label}</Eyebrow>
          <LineReveal
            id="showreel-title"
            lines={accentLast(reel.headline)}
            className="display mt-6 text-[clamp(2.8rem,9vw,8rem)] text-bone md:mt-8 lg:text-[clamp(2.8rem,7.5vw,8rem)]"
          />
        </div>
        <Reveal className="lg:col-span-4 lg:pb-3" delay={0.2}>
          <p className="max-w-sm text-bone/75">
            Twenty-one seconds of editing, motion and sound design — the fastest way to see how I work.
          </p>
          <p className="label mt-4 text-dim">
            {reel.title} · 16:9 · Sound on
          </p>
        </Reveal>
      </div>

      <ClipReveal className="corners -mx-2 mt-10 p-2 text-bone/25 md:mx-0 md:mt-16 lg:mt-20 lg:p-3">
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

export function SkillsMarquee() {
  return <ScrollMarquee items={site.about.strengths} />;
}

export function WorkSection() {
  return (
    <section id="work" aria-labelledby="work-title" className="shell py-20 md:py-32 lg:py-36">
      <div className="mb-10 grid gap-6 md:mb-14 lg:mb-20 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-8">
          <Eyebrow index="02">Selected projects</Eyebrow>
          <LineReveal
            id="work-title"
            as="h2"
            lines={accentLast(["Work that", "moves."])}
            className="display mt-6 text-[clamp(2.8rem,11vw,8rem)] text-bone md:mt-8 lg:text-[clamp(2.8rem,7.5vw,8rem)]"
          />
        </div>
        <Reveal className="lg:col-span-4 lg:pb-3" delay={0.15}>
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
      <div className="shell grid gap-12 py-20 md:py-32 lg:grid-cols-12 lg:gap-16 lg:py-40">
        <div className="lg:col-span-7">
          <Eyebrow index="03">About</Eyebrow>
          <LineReveal
            id="about-title"
            lines={accentLast(about.headline)}
            className="display mt-6 text-[clamp(2.8rem,10.5vw,6.75rem)] text-bone md:mt-8 lg:text-[clamp(2.8rem,6.1vw,6.75rem)]"
          />
          {about.portrait && (
            <ClipReveal className="relative mt-14 aspect-[4/5] max-w-md overflow-hidden bg-coal">
              <Image src={about.portrait.src} alt={about.portrait.alt} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />
            </ClipReveal>
          )}
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-10 lg:col-span-5 lg:block lg:pt-24">
          <div className="space-y-6 text-lg leading-relaxed text-bone/80 lg:text-xl">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? "text-bone" : undefined}>{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-12 md:mt-0 lg:mt-14">
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
      <div className="shell py-20 md:py-32 lg:py-40">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <Eyebrow index="04">Services</Eyebrow>
            <LineReveal
              id="services-title"
              lines={accentLast(["What I can", "make for you."])}
              className="display mt-6 text-[clamp(2.8rem,10.5vw,7.5rem)] text-bone md:mt-8 lg:text-[clamp(2.8rem,7.2vw,7.5rem)]"
            />
          </div>
          <Reveal className="lg:col-span-4 lg:pb-3" delay={0.15}>
            <p className="max-w-sm text-bone/75">{site.pricing.note}</p>
            {site.pricing.startingAt && (
              <p className="label mt-4 text-bone">Projects from {site.pricing.startingAt}</p>
            )}
          </Reveal>
        </div>

        <ol className="mt-12 border-t border-line md:mt-16 lg:mt-24">
          {site.services.map((s, i) => (
            <li key={s.id} className="border-b border-line">
              <Reveal
                className="group grid gap-4 py-9 md:grid-cols-[4rem_1fr] md:gap-x-6 lg:grid-cols-12 lg:items-baseline lg:gap-8 lg:py-14"
                y={20}
              >
                <span className="label pt-2 text-signal lg:col-span-1 lg:pt-0">{String(i + 1).padStart(2, "0")} —</span>
                <div className="md:col-start-2 lg:contents">
                  <h3 className="display text-[clamp(2.1rem,8vw,4.25rem)] text-bone transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] lg:col-span-6 lg:text-[clamp(2rem,4.2vw,4.25rem)] lg:group-hover:translate-x-3">
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-md text-bone/70 lg:col-span-3 lg:mt-0">{s.body}</p>
                  <div className="mt-6 lg:col-span-2 lg:mt-0 lg:text-right">
                    <InquireButton type={s.inquiryType} service={s.title} />
                  </div>
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
      <div className="shell py-20 md:py-32 lg:py-40">
        <Eyebrow index="05">Creative process</Eyebrow>
        <LineReveal
          id="process-title"
          lines={accentLast(["From brief", "to final frame."])}
          className="display mt-6 text-[clamp(2.8rem,10.5vw,7.5rem)] text-bone md:mt-8 lg:text-[clamp(2.8rem,7.2vw,7.5rem)]"
        />
        <ProcessSteps steps={site.process} />
      </div>
    </section>
  );
}

export function ContactSection() {
  const c = site.contact;
  const follow = socialLinks().filter((l) => l.external && l.key !== "whatsapp");
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative border-t border-line">
      <div className="shell grid gap-14 py-20 md:py-32 lg:grid-cols-12 lg:gap-16 lg:py-40">
        <div className="lg:col-span-6">
          <Eyebrow index="06">Contact</Eyebrow>
          <LineReveal
            id="contact-title"
            lines={accentLast(c.headline)}
            className="display mt-6 text-[clamp(2.6rem,9.6vw,6rem)] text-bone md:mt-8 lg:text-[clamp(2.8rem,5.3vw,6rem)]"
          />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-bone/80 md:mt-10">{c.intro}</p>
          </Reveal>

          <Reveal delay={0.15} className="mt-10 md:mt-14">
            <ContactDirect />
          </Reveal>

          {follow.length > 0 && (
            <Reveal delay={0.2} className="mt-10">
              <p className="label text-dim">Follow the work</p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
                {follow.map((l) => (
                  <li key={l.key}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-block py-1 text-bone/85 hover:text-bone"
                    >
                      {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        <Reveal className="lg:col-span-6 lg:pt-20" delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
