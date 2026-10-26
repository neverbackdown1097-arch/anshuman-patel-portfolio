import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { getProduct, products } from "@/content/products";
import { VideoPlayer } from "@/components/video-player";
import { Eyebrow, LineReveal, Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { BuyButton, ProductName } from "@/components/product-feature";
import { ProductGallery, type GalleryItem } from "@/components/product-gallery";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const title = `${p.name} ${p.accent ?? ""} — ${p.facts[0].value} ${p.kind}s`.replace(/\s+/g, " ");
  return {
    title,
    description: `${p.headline} ${p.tagline}`,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      url: `/products/${p.slug}`,
      title: `${p.name} ${p.accent ?? ""} | ${site.name}`,
      description: p.tagline,
      images: [{ url: p.media.poster, width: 1920, height: 1080, alt: p.media.posterAlt }],
    },
    twitter: { card: "summary_large_image", title: `${p.name} ${p.accent ?? ""}`, description: p.tagline, images: [p.media.poster] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const catName = Object.fromEntries(p.categories.map((c) => [c.id, c.name]));
  const items: GalleryItem[] = p.items.map((t) => {
    const id = `TL${String(t.n).padStart(2, "0")}`;
    return { id, n: t.n, cat: t.cat, catName: catName[t.cat], name: t.name, frames: t.frames, ...p.media.gallery(id) };
  });
  const fullName = `${p.name}${p.accent ? ` ${p.accent}` : ""}`;

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: fullName,
          description: `${p.headline} ${p.tagline}`,
          image: [`${site.url}${p.media.poster}`],
          brand: { "@type": "Person", name: site.name },
          category: p.kind,
          offers: {
            "@type": "Offer",
            price: p.price.amount,
            priceCurrency: p.price.currency,
            availability: "https://schema.org/InStock",
            url: p.store.url,
          },
        }}
      />

      {/* Hero */}
      <header className="shell pt-[calc(var(--nav-h)+3rem)] md:pt-[calc(var(--nav-h)+6rem)]">
        <nav aria-label="Breadcrumb" className="label flex items-center gap-3 text-mute">
          <Link href="/#shop" className="link-underline hover:text-bone">
            ← Shop
          </Link>
          <span aria-hidden className="text-dim">/</span>
          <span aria-current="page" className="text-dim">
            {p.kind}
          </span>
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <LineReveal
              as="h1"
              immediate
              delay={0.1}
              lines={[<ProductName key="n" p={p} />]}
              className="display text-[clamp(3.6rem,15vw,12rem)] text-bone lg:text-[clamp(3.6rem,10vw,12rem)]"
            />
            <Reveal delay={0.3}>
              <p className="mt-6 font-serif text-3xl italic text-signal md:text-4xl">{p.headline}</p>
              <p className="mt-6 max-w-xl text-lg text-bone/75">{p.tagline}</p>
            </Reveal>
          </div>

          <Reveal delay={0.4} className="lg:col-span-4">
            <div className="border border-line bg-coal p-6 md:p-8">
              <p className="label text-dim">One-time purchase</p>
              <p className="display mt-3 text-7xl text-bone">
                {p.price.label}
                <span className="label ml-2 align-middle text-mute">{p.price.currency}</span>
              </p>
              <BuyButton p={p} className="mt-6 w-full" />
              <ul className="mt-6 space-y-2 text-sm text-bone/75">
                <li>✓ {p.facts[0].value} transitions in {p.facts[1].value} styles</li>
                <li>✓ HD + 4K UHD, landscape + vertical</li>
                <li>✓ No plug-ins — Premiere Pro 2026</li>
              </ul>
              <p className="label mt-6 text-dim">Checkout on {p.store.name}</p>
            </div>
          </Reveal>
        </div>
      </header>

      {/* Showreel */}
      <section aria-label="Showreel" className="shell mt-14 md:mt-20">
        <Reveal delay={0.5}>
          <VideoPlayer
            src={p.media.film}
            poster={p.media.poster}
            posterAlt={p.media.posterAlt}
            title={`${fullName} showreel`}
            duration={44}
            preload
          />
          <p className="label mt-4 text-center text-dim">Showreel · all {p.facts[0].value} transitions · sound on</p>
        </Reveal>
      </section>

      {/* Facts */}
      <section aria-label="At a glance" className="shell mt-16 md:mt-24">
        <dl className="grid grid-cols-2 border-t border-line sm:grid-cols-3 lg:grid-cols-6">
          {p.facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.05} className="border-b border-line py-6 pr-4 lg:border-b-0">
              <dt className="label text-dim">{f.label}</dt>
              <dd className="display mt-2 text-5xl text-bone md:text-6xl">{f.value}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Gallery */}
      <section aria-labelledby="gallery-title" className="shell mt-24 md:mt-36">
        <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow index="01">The library</Eyebrow>
            <LineReveal
              id="gallery-title"
              lines={["Every transition,", <span key="b">previewed<span className="text-signal">.</span></span>]}
              className="display mt-6 text-[clamp(2.8rem,10vw,7rem)] text-bone lg:text-[clamp(2.8rem,6.5vw,7rem)]"
            />
          </div>
          <Reveal className="lg:col-span-4 lg:pb-3" delay={0.15}>
            <p className="max-w-sm text-bone/75">
              Hover a tile to play it — on a phone, just scroll. Filter by style to find the right cut for your edit.
            </p>
          </Reveal>
        </div>
        <ProductGallery items={items} categories={p.categories} fps={p.fps} />
      </section>

      {/* Features */}
      <section aria-labelledby="features-title" className="mt-24 border-y border-line bg-coal md:mt-36">
        <div className="shell py-20 md:py-28">
          <Eyebrow index="02">Built the right way</Eyebrow>
          <LineReveal
            id="features-title"
            lines={["No plug-ins.", <span key="b">No <span className="font-serif normal-case italic tracking-normal text-signal">compromise.</span></span>]}
            className="display mt-6 text-[clamp(2.8rem,10vw,7rem)] text-bone lg:text-[clamp(2.8rem,6.5vw,7rem)]"
          />
          <ul className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {p.features.map((f, i) => (
              <li key={f.title} className="bg-coal p-6 md:p-8">
                <Reveal delay={i * 0.06}>
                  <p className="label text-signal">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="display mt-4 text-3xl text-bone">{f.title}</h3>
                  <p className="mt-3 text-bone/70">{f.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What's inside + requirements */}
      <section className="shell mt-24 grid gap-16 md:mt-36 lg:grid-cols-12">
        <div className="lg:col-span-7" aria-labelledby="inside-title">
          <Eyebrow index="03">What&apos;s inside</Eyebrow>
          <h2 id="inside-title" className="display mt-6 text-[clamp(2.4rem,7vw,4.5rem)] text-bone">
            Six folders. Ready to edit.
          </h2>
          <ol className="mt-8 border-t border-line">
            {p.inside.map((f) => (
              <li key={f.folder} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-5">
                <span className="label pt-1 text-signal">{f.folder}</span>
                <div>
                  <p className="text-lg text-bone">{f.title}</p>
                  <p className="mt-1 text-bone/65">{f.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-5" aria-labelledby="req-title">
          <Eyebrow index="04">Requirements</Eyebrow>
          <h2 id="req-title" className="display mt-6 text-[clamp(2.4rem,7vw,4.5rem)] text-bone">
            What you need.
          </h2>
          <dl className="mt-8 border-t border-line">
            {p.requirements.map((r) => (
              <div key={r.item} className="border-b border-line py-5">
                <dt className="label text-dim">{r.item}</dt>
                <dd className="mt-1 text-lg text-bone">{r.value}</dd>
                {r.note && <dd className="mt-1 text-sm text-bone/60">{r.note}</dd>}
              </div>
            ))}
          </dl>

          <p className="label mt-10 text-dim">Made for</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {p.audience.map((a) => (
              <li key={a} className="rounded-full border border-line px-3.5 py-2 text-sm text-bone/80">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section aria-label="Buy" className="shell mt-24 md:mt-36">
        <Reveal className="border border-line p-8 text-center md:p-16">
          <p className="label text-mute">{p.kind}</p>
          <p className="display mt-4 text-[clamp(3rem,10vw,8rem)] text-bone">
            <ProductName p={p} />
          </p>
          <p className="mx-auto mt-4 max-w-md text-bone/70">{p.headline}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <BuyButton p={p} />
            <Link
              href="/#contact"
              className="label inline-flex items-center gap-3 border border-bone/40 px-6 py-4 text-bone transition-colors hover:border-bone hover:bg-bone/5"
            >
              Need custom transitions? Let&apos;s talk
            </Link>
          </div>
          <p className="mx-auto mt-10 max-w-xl text-xs leading-relaxed text-dim">{p.licence}</p>
        </Reveal>
      </section>

      <div className="h-24 md:h-36" />
    </article>
  );
}
