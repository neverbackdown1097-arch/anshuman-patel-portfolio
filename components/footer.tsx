import Link from "next/link";
import { navItems, site, socialLinks } from "@/content/site";
import { BackToTop, Year } from "./footer-client";

export function Footer() {
  const links = socialLinks();
  return (
    <footer className="relative border-t border-line">
      <div className="shell grid gap-14 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <p className="label text-mute">{site.footer.roles}</p>
          <p className="mt-6 max-w-lg font-serif text-4xl italic leading-tight text-bone/90 md:text-5xl">
            {site.footer.tagline}
          </p>
          <Link href="/#contact" className="label link-underline mt-8 inline-block text-signal">
            Start a project ↗
          </Link>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 md:col-span-5 md:justify-items-end">
          <ul className="space-y-3">
            <li className="label text-dim">Index</li>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline text-bone/85 hover:text-bone">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {links.length > 0 && (
            <ul className="space-y-3">
              <li className="label text-dim">Elsewhere</li>
              {links.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    className="link-underline text-bone/85 hover:text-bone"
                    {...(s.key === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {s.label}
                    {s.key !== "email" && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>

      {/* Full-bleed wordmark, sized to the viewport so it always sits on one line. */}
      <div className="shell overflow-hidden" aria-hidden>
        <p className="display whitespace-nowrap pb-[1vw] pt-[1.5vw] text-[12.9vw] leading-[0.8] text-bone">
          {site.wordmark}
          <span className="ml-[0.04em] inline-block align-top text-[0.2em] leading-none">®</span>
        </p>
      </div>

      <div className="shell flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="label text-dim">
          © <Year /> {site.name}. All rights reserved.
        </p>
        <BackToTop />
      </div>
    </footer>
  );
}
