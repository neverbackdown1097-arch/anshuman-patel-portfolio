import Link from "next/link";
import type { Product } from "@/content/products";
import { ClipReveal, Eyebrow, LineReveal, Reveal } from "./reveal";
import { LoopVideo } from "./loop-video";

/** Name with its accent part (e.g. "50") set in the signal colour. */
export function ProductName({ p }: { p: Product }) {
  return (
    <>
      {p.name}
      {p.accent && <span className="text-signal"> {p.accent}</span>}
    </>
  );
}

export function BuyButton({ p, className = "" }: { p: Product; className?: string }) {
  return (
    <a
      href={p.store.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`label group inline-flex items-center justify-center gap-3 bg-signal px-7 py-4 text-ink transition-[background-color,transform] duration-300 hover:bg-bone active:scale-[0.98] ${className}`}
    >
      Get it for {p.price.label}
      <span aria-hidden className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
        ↗
      </span>
      <span className="sr-only"> on {p.store.name} (opens in a new tab)</span>
    </a>
  );
}

/** Home-page feature for a digital product. */
export function ProductFeature({ p }: { p: Product }) {
  return (
    <section id="shop" aria-labelledby="shop-title" className="border-t border-line bg-coal">
      <div className="shell py-20 md:py-32 lg:py-36">
        <Eyebrow index="✦">Digital product · {p.kind}</Eyebrow>

        <div className="mt-8 grid gap-10 md:mt-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <ClipReveal className="lg:col-span-7">
            <Link href={`/products/${p.slug}`} data-cursor="Open" className="group relative block overflow-hidden">
              <div className="relative aspect-video bg-ink">
                <LoopVideo src={p.media.loop} poster={p.media.poster} className="absolute inset-0 h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <span className="label absolute bottom-4 left-4 flex items-center gap-2 text-bone">
                  <span className="size-1.5 rounded-full bg-signal" aria-hidden /> Live preview · {p.facts[0].value} {p.facts[0].label.toLowerCase()}
                </span>
                <span className="label absolute bottom-4 right-4 hidden text-bone opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:block">
                  See all {p.facts[0].value} →
                </span>
              </div>
            </Link>
          </ClipReveal>

          <div className="lg:col-span-5">
            <LineReveal
              id="shop-title"
              lines={[<ProductName key="n" p={p} />]}
              className="display text-[clamp(3rem,12vw,7rem)] text-bone lg:text-[clamp(3rem,6vw,6.5rem)]"
            />
            <Reveal delay={0.1}>
              <p className="mt-5 font-serif text-2xl italic text-bone/90 md:text-3xl">{p.headline}</p>
              <p className="mt-5 max-w-md text-bone/70">{p.tagline}</p>
            </Reveal>

            <Reveal delay={0.15}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {p.facts.map((f) => (
                  <li key={f.label} className="label rounded-full border border-line px-3.5 py-2 text-bone/80">
                    <span className="text-bone">{f.value}</span> {f.label}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center gap-3">
              <BuyButton p={p} />
              <Link
                href={`/products/${p.slug}`}
                className="label inline-flex items-center gap-3 border border-bone/40 px-6 py-4 text-bone transition-colors hover:border-bone hover:bg-bone/5"
              >
                Preview all {p.facts[0].value} →
              </Link>
            </Reveal>
            <p className="label mt-5 text-dim">
              Sold on {p.store.name} · For Premiere Pro 2026
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
