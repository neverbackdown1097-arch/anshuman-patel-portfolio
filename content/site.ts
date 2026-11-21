/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — edit this file to change who you are, how people
 *  reach you, the showreel, services and SEO. Projects live in
 *  ./projects.ts. Leave a link as "" to hide it everywhere on the site.
 * ─────────────────────────────────────────────────────────────────────────
 */

/** A price add-on: either a USD amount (converted by the currency switch) or plain text like "+30%". */
export type AddOn = { label: string; usd?: number; text?: string; prefix?: string; suffix?: string };

export const site = {
  name: "Anshuman Patel",
  /** Shown in the nav and footer, with the ® mark. */
  wordmark: "ANSHUMAN PATEL",
  title: "Video Editor & Motion Designer",
  /** Long-form role used in SEO and structured data. */
  jobTitle: "Cinematic Video Editor & Motion Graphics Designer",

  /**
   * Public URL of the live site, without a trailing slash. Set
   * NEXT_PUBLIC_SITE_URL in your host (e.g. https://anshumanpatel.in);
   * on Vercel the production domain is picked up automatically.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  availability: {
    /** Set to false to hide the green "available" indicator. */
    open: true,
    label: "Available for select projects",
  },

  hero: {
    lines: ["I turn ideas", "into visual", "experiences."],
    intro:
      "Cinematic Video Editor & Motion Designer crafting stories, motion, and visuals that make brands impossible to ignore.",
    /** Silent, text-free background loop (see scripts/prepare-media.mjs). */
    video: "/media/hero/hero.mp4",
    videoMobile: "/media/hero/hero-mobile.mp4",
    poster: "/media/hero/hero-poster.jpg",
    label: "Independent video editor & motion designer",
  },

  showreel: {
    label: "Selected work / 2026",
    headline: ["A few seconds.", "A lasting impression."],
    /** Any MP4/WebM URL. Set to "" to show a "coming soon" panel instead. */
    src: "/media/showreel/film.mp4",
    poster: "/media/showreel/poster.jpg",
    title: "Showreel 2026",
    duration: 21,
  },

  about: {
    headline: ["More than an edit.", "It's a feeling."],
    paragraphs: [
      "I'm Anshuman Patel, a video editor and motion designer passionate about turning ideas into visually compelling stories.",
      "From cinematic storytelling to kinetic typography and brand-focused motion graphics, I combine editing, rhythm, sound, and visual design to create work that captures attention and leaves a lasting impression.",
      "My approach is simple: every frame should have a purpose, every transition should feel intentional, and every story should make people feel something.",
    ],
    strengths: [
      "Cinematic Editing",
      "Motion Graphics",
      "Kinetic Typography",
      "Storytelling",
      "Sound Design",
      "Color Grading",
    ],
    /** Add a real portrait later, e.g. { src: "/media/about/portrait.jpg", alt: "Anshuman Patel at his edit desk" } */
    portrait: null as null | { src: string; alt: string },
  },

  /**
   * Services and rates (USD). `price` is a starting price ("From $X");
   * `inquiryType` is pre-selected in the contact form by "Start a project".
   */
  services: [
    {
      id: "social",
      inquiryType: "Social edit (Reels / Shorts / TikTok)",
      title: "Social Edits",
      scope: "Reels, Shorts & TikTok · up to 60 s",
      body: "Scroll-stopping short-form edits with pacing, captions and sound that keep people watching.",
      includes: ["Edit & pacing", "Animated captions", "Sound design", "Colour", "9:16 + 1:1 versions", "2 revision rounds"],
      price: 120,
      unit: "per video",
    },
    {
      id: "longform",
      inquiryType: "YouTube / long-form edit",
      title: "YouTube & Long-form",
      scope: "8–15 minute videos",
      body: "Story-driven long-form edits that hold attention from the hook to the final second.",
      includes: ["Edit & story structure", "B-roll", "Titles", "Music & SFX", "Colour", "Thumbnail-ready stills"],
      price: 400,
      unit: "per video",
    },
    {
      id: "motion",
      inquiryType: "Motion graphics / kinetic type",
      title: "Motion Graphics & Kinetic Type",
      scope: "Up to 30 s",
      body: "Animated graphics and typography built from your script or brand assets.",
      includes: ["Animation from your script or assets", "Kinetic typography", "Sound design", "2 revision rounds"],
      price: 450,
      unit: "per piece",
    },
    {
      id: "brand",
      inquiryType: "Brand or product film",
      title: "Brand & Product Films",
      scope: "Up to 60 s",
      body: "A complete film from idea to final mix — for launches, websites and campaigns.",
      includes: ["Concept", "Script support", "Storyboard", "Motion & edit", "Full sound design"],
      price: 1500,
      unit: "per film",
    },
    {
      id: "3d",
      inquiryType: "3D product animation",
      title: "3D Product Animation",
      scope: "10–20 s · Blender",
      body: "Product renders and 3D motion that show your product the way a camera can't.",
      includes: ["Modelling", "Lighting", "Animation", "Rendering", "Final edit"],
      price: 900,
      unit: "per animation",
    },
  ],

  pricing: {
    /** USD → INR rate used by the currency switch. INR prices are rounded. Update when the rate moves. */
    inrRate: 88,
    note: "Clear starting prices for the most-requested work. Larger or more complex projects are quoted on scope, so share your brief and I'll reply with a tailored proposal.",
    plans: [
      {
        id: "starter",
        name: "Starter",
        price: 800,
        includes: ["8 social edits a month", "Captions, sound and colour on every edit", "9:16 + 1:1 versions"],
        inquiryType: "Monthly plan",
      },
      {
        id: "brand-motion",
        name: "Brand Motion",
        price: 2500,
        featured: true,
        includes: ["4 motion pieces a month (up to 30 s)", "8 social edits a month", "One consistent motion language for your brand"],
        inquiryType: "Monthly plan",
      },
      {
        id: "growth",
        name: "Growth",
        price: 1500,
        includes: ["16 social edits a month", "Priority turnaround", "Captions, sound and colour on every edit"],
        inquiryType: "Monthly plan",
      },
    ],
    addOns: [
      { label: "Rush delivery (48 hours)", text: "+30%" },
      { label: "Extra revision round", usd: 50 },
      { label: "Extra aspect-ratio cutdown", usd: 40, suffix: " each" },
      { label: "Script or concept writing", usd: 100, prefix: "From " },
      { label: "Source project files", text: "+25%" },
      { label: "Stock footage & music licences", text: "At cost" },
    ] as AddOn[],
    hourly: { hour: 40, day: 300 },
    terms: ["50% upfront, 50% on delivery", "Prices exclude taxes", "Anything outside these packages is quoted on scope"],
  },

  process: [
    { title: "Discover", body: "Understand the brand, audience, objective, and creative direction." },
    { title: "Concept", body: "Develop the story, visual language, references, and motion approach." },
    { title: "Create", body: "Edit, animate, design sound, and refine every detail." },
    { title: "Deliver", body: "Finalize the work and prepare the required formats for delivery." },
  ],

  contact: {
    headline: ["Have a good idea?", "Let's make it unforgettable."],
    intro:
      "Have a project in mind? Tell me what you're creating, and let's explore how we can bring it to life.",
    projectTypes: [
      "Social edit (Reels / Shorts / TikTok)",
      "YouTube / long-form edit",
      "Motion graphics / kinetic type",
      "Brand or product film",
      "3D product animation",
      "Monthly plan",
      "Cinematic video editing",
      "Travel film",
      "Video essay",
      "SaaS / product video",
      "Something else",
    ],
    /** Budget choices are optional for the visitor. Replace with your own ranges if you like. */
    budgets: [
      "Not sure yet",
      "Under $500",
      "$500 – $1,500",
      "$1,500 – $3,000",
      "$3,000+",
      "Monthly plan",
    ],
  },

  /** Leave any value as "" to hide it. */
  social: {
    email: "anshumanpatel619@gmail.com",
    /** Digits only, with country code. Used for tel: and WhatsApp links. */
    phone: "917651916121",
    /** WhatsApp chat on the same number. Set to "" to hide. */
    whatsapp: "https://wa.me/917651916121",
    linkedin: "https://www.linkedin.com/in/anshuman-patel-069b04193/",
    instagram: "https://www.instagram.com/anshuman__1097/",
    x: "https://x.com/Anshuma26586120",
    vimeo: "",
    youtube: "",
  },

  footer: {
    roles: "Video editor · Motion designer",
    tagline: "Let's create something that matters.",
  },

  seo: {
    title: "Anshuman Patel — Video Editor & Motion Graphics Designer",
    description:
      "Portfolio of Anshuman Patel, a freelance video editor and motion graphics designer creating cinematic brand films, kinetic typography and social video that people remember.",
    keywords: [
      "video editor portfolio",
      "freelance video editor",
      "motion graphics designer",
      "kinetic typography designer",
      "cinematic video editing",
      "brand video editor",
      "video editing services",
    ],
    locale: "en_IN",
  },
} as const;

/** Navigation. Hash links point at sections on the home page. */
export const navItems = [
  { label: "Work", href: "/#work" },
  { label: "3D", href: "/#three-d" },
  { label: "Shop", href: "/#shop" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
];

export type SocialKey = keyof typeof site.social;

export const socialLabels: Record<SocialKey, string> = {
  email: "Email",
  phone: "Call",
  whatsapp: "WhatsApp",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X / Twitter",
  vimeo: "Vimeo",
  youtube: "YouTube",
};

/** "917651916121" → "+91 76519 16121" */
export function formatPhone(digits: string) {
  const cc = digits.slice(0, digits.length - 10);
  const n = digits.slice(-10);
  return `${cc ? `+${cc} ` : ""}${n.slice(0, 5)} ${n.slice(5)}`;
}

const hrefFor = (k: SocialKey) =>
  k === "email" ? `mailto:${site.social.email}` : k === "phone" ? `tel:+${site.social.phone}` : site.social[k];

/** Configured links in display order. `external` links open in a new tab. */
export function socialLinks() {
  return (Object.keys(site.social) as SocialKey[])
    .filter((k) => site.social[k])
    .map((k) => ({
      key: k,
      label: socialLabels[k],
      href: hrefFor(k),
      external: k !== "email" && k !== "phone",
    }));
}
