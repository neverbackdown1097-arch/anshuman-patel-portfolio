import type { Metadata, Viewport } from "next";
import { Anton, Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Cursor } from "@/components/cursor";
import { FloatingCta } from "@/components/floating-cta";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: "italic",
  subsets: ["latin"],
});
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", weight: ["400", "500"], subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.seo.title, template: `%s | ${site.name}` },
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.seo.locale,
    title: site.seo.title,
    description: site.seo.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    creator: site.social.x ? `@${site.social.x.split("/").pop()}` : undefined,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${interTight.variable} ${instrumentSerif.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="label sr-only z-[100] bg-signal px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Providers>
          <Nav />
          <main id="main" tabIndex={-1} className="outline-none">{children}</main>
          <Footer />
          <Cursor />
          <FloatingCta />
        </Providers>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
