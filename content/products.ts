/**
 * ─────────────────────────────────────────────────────────────────────────
 *  DIGITAL PRODUCTS — shown on the home page and at /products/<slug>.
 *  Price and store link must match the live listing. Media is built by
 *  `npm run media <slug>` (see the `products` block in prepare-media.mjs).
 * ─────────────────────────────────────────────────────────────────────────
 */
import tlData from "./products/transition-lab.json";

export type Product = {
  slug: string;
  name: string;
  /** Part of the name to set in the accent colour, e.g. "50". */
  accent?: string;
  kind: string;
  headline: string;
  tagline: string;
  price: { amount: number; currency: string; label: string };
  store: { name: string; url: string };
  media: { film: string; poster: string; posterAlt: string; loop: string; gallery: (id: string) => { video: string; poster: string } };
  facts: { value: string; label: string }[];
  categories: { id: string; name: string }[];
  items: { n: number; cat: string; name: string; frames: number; usesElement: boolean }[];
  fps: number;
  inside: { folder: string; title: string; body: string }[];
  features: { title: string; body: string }[];
  requirements: { item: string; value: string; note?: string }[];
  audience: string[];
  licence: string;
};

export const products: Product[] = [
  {
    slug: "transition-lab",
    name: "Transition Lab",
    accent: "50",
    kind: "Premiere Pro transition pack",
    headline: "50 transitions. Unlimited creative possibilities.",
    tagline:
      "Upgrade your editing workflow with 50 creative Premiere Pro transitions and make every cut count — built on Premiere's own effects, with no plug-ins.",
    price: { amount: 50, currency: "USD", label: "$50" },
    store: { name: "Contra", url: "https://contra.com/products/sJGAxHmF-transition-lab" },
    media: {
      film: "/media/transition-lab/film.mp4",
      poster: "/media/transition-lab/poster.jpg",
      posterAlt: "Transition Lab 50 title card: 50 transitions, unlimited creative possibilities",
      loop: "/media/transition-lab/loop.mp4",
      gallery: (id) => ({ video: `/media/transition-lab/gallery/${id}.mp4`, poster: `/media/transition-lab/gallery/${id}.jpg` }),
    },
    facts: [
      { value: "50", label: "Transitions" },
      { value: "10", label: "Styles" },
      { value: "21", label: "Light & matte elements" },
      { value: "4K", label: "HD + UHD presets" },
      { value: "9:16", label: "Vertical-ready" },
      { value: "0", label: "Plug-ins needed" },
    ],
    categories: tlData.categories,
    items: tlData.transitions,
    fps: tlData.fps,
    inside: [
      { folder: "01", title: "Presets", body: "Effect presets (.prfpset) — one all-in-one file, one per style, plus a UHD set for 4K timelines." },
      { folder: "02", title: "Elements", body: "21 rendered light, energy and matte elements in four sizes: 16:9 and 9:16, HD and UHD." },
      { folder: "03", title: "Demo project", body: "Every transition already built on a timeline, ready to copy straight into your edit." },
      { folder: "04", title: "Showreel", body: "A 44-second showcase of all 50 transitions." },
      { folder: "05", title: "Preview gallery", body: "A preview clip of every transition in 16:9 and 9:16." },
      { folder: "06", title: "Documentation", body: "Install, customisation, compatibility, troubleshooting and a quality-control report." },
    ],
    features: [
      {
        title: "Native Premiere effects",
        body: "Every preset is built from effects that ship with Premiere Pro 2026. No third-party plug-ins, scripts, extensions or fonts.",
      },
      {
        title: "Drag, drop, done",
        body: "Adjustment-layer and clip presets drop onto the cut. Positions are stored as fractions of the frame, so they adapt to any size.",
      },
      {
        title: "Any frame, any rate",
        body: "Tested at 1080p, vertical 1080×1920 and 4K UHD. Time-based presets work from 23.976 to 60 fps.",
      },
      {
        title: "Fully editable",
        body: "Every parameter stays live in Effect Controls — tweak blur, speed, glow or direction to match your footage.",
      },
    ],
    requirements: [
      { item: "Premiere Pro", value: "2026 (v26.0 or later)", note: "Tested on 26.2.2. Uses effects bundled with Premiere 2026." },
      { item: "System", value: "Windows 10 / 11 (64-bit)", note: "Files are cross-platform; macOS expected to work but not tested." },
      { item: "GPU", value: "4 GB VRAM for HD", note: "6 GB+ recommended for UHD." },
      { item: "RAM", value: "16 GB", note: "32 GB recommended for UHD." },
      { item: "Plug-ins & fonts", value: "None" },
    ],
    audience: [
      "Freelance and professional editors",
      "Content creators and social media managers",
      "YouTubers and Reels creators",
      "Filmmakers and motion designers",
      "Creative agencies",
    ],
    licence:
      "Use the transitions and elements in personal and client work. Demo footage and showreel music are free stock included for demonstration only and aren't for redistribution on their own.",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
