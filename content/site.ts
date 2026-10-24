/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — edit this file to change who you are, how people
 *  reach you, the showreel, services and SEO. Projects live in
 *  ./projects.ts. Leave a link as "" to hide it everywhere on the site.
 * ─────────────────────────────────────────────────────────────────────────
 */

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

  services: [
    {
      id: "editing",
      /** Pre-selected in the contact form when "Start a project" is clicked. */
      inquiryType: "Cinematic video editing",
      title: "Cinematic Video Editing",
      body: "Story-driven editing, pacing, transitions, and visual refinement for films, brands, and digital content.",
    },
    {
      id: "motion",
      inquiryType: "Motion graphics",
      title: "Motion Graphics",
      body: "Professional animated graphics, visual storytelling, and sophisticated motion design for brands and campaigns.",
    },
    {
      id: "typography",
      inquiryType: "Kinetic typography",
      title: "Kinetic Typography",
      body: "High-impact typography animation, title sequences, text-driven storytelling, and visually engaging promotional content.",
    },
    {
      id: "social",
      inquiryType: "Social media content",
      title: "Social Media & Brand Content",
      body: "Polished short-form videos, promotional edits, campaign visuals, and branded content for digital platforms.",
    },
  ],

  /**
   * Pricing model. Keep `startingAt` empty for project-based quotes only,
   * or set it (e.g. "₹15,000") to show "Projects from …" under Services.
   */
  pricing: {
    note: "Every project is quoted on its scope. Share your brief and I'll reply with a tailored proposal.",
    startingAt: "",
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
      "Cinematic video editing",
      "Motion graphics",
      "Kinetic typography",
      "Brand film",
      "Social media content",
      "Travel film",
      "Something else",
    ],
    /** Budget choices are optional for the visitor. Replace with your own ranges if you like. */
    budgets: [
      "Not sure yet",
      "Single short-form video",
      "Campaign or content series",
      "Brand film",
      "Ongoing retainer",
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
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
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
