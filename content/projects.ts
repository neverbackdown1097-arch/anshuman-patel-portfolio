/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PROJECTS — every card, filter, case study, sitemap entry and VideoObject
 *  comes from this list. To add a project:
 *    1. Put the master render in your media source folder and add a job for
 *       it in scripts/prepare-media.mjs (poster/still timestamps).
 *    2. Run `npm run media <slug>` — it writes /public/media/<slug>/…
 *    3. Copy an entry below, change the slug and the copy.
 *  Media can also be absolute URLs (Vimeo/Mux/R2/Cloudinary MP4 links).
 *  Set `placeholder: true` on unfinished entries: they get a visible
 *  "Placeholder" tag and are kept out of the sitemap and structured data.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const categories = [
  "Cinematic Storytelling",
  "Motion Graphics",
  "Kinetic Typography",
  "Brand Films",
  "Social Media Videos",
  "Travel Films",
  "SaaS & Product Videos",
] as const;

export type Category = (typeof categories)[number];

export type Still = { src: string; alt: string };

export type Project = {
  slug: string;
  title: string;
  /** Short line under the title, e.g. the film's tagline. */
  subtitle: string;
  /** Brand the work was made for. Leave undefined for self-initiated work. */
  brand?: string;
  /** Plain-language context, e.g. "Self-initiated film". */
  context: string;
  /** Publication date (YYYY-MM-DD). */
  date: string;
  categories: Category[];
  format: "16:9" | "9:16";
  /** Running time in seconds. */
  duration: number;
  /** One or two sentences for cards and meta descriptions. */
  summary: string;
  role: string[];
  /** Software you want to show. Leave empty to hide the row. */
  tools: string[];
  /** Third-party material used (music, stock). Shown on the case study. */
  credits: string[];
  media: {
    film: string;
    preview?: string;
    poster: string;
    posterAlt: string;
    stills: Still[];
  };
  /** Case-study sections. Omit any you don't want to show. */
  story: {
    overview: string;
    challenge?: string;
    concept?: string;
    edit?: string;
    motion?: string;
    sound?: string;
    color?: string;
  };
  placeholder?: boolean;
};

const media = (slug: string, posterAlt: string, stills: string[]) => ({
  film: `/media/${slug}/film.mp4`,
  preview: `/media/${slug}/preview.mp4`,
  poster: `/media/${slug}/poster.jpg`,
  posterAlt,
  stills: stills.map((alt, i) => ({ src: `/media/${slug}/still-${i + 1}.jpg`, alt })),
});

export const projects: Project[] = [
  {
    slug: "the-power-of-one-frame",
    title: "The Power of One Frame",
    subtitle: "Make them feel it.",
    context: "Self-initiated film",
    date: "2026-10-22",
    categories: ["Cinematic Storytelling"],
    format: "16:9",
    duration: 68.5,
    summary:
      "A cinematic short about the craft of editing itself — rhythm, detail and feeling, cut to voice and music.",
    role: ["Concept", "Editing", "Motion design", "Sound design", "Color grading"],
    tools: [],
    credits: ["Footage: licensed stock (Pexels)", "Music: “Miss You” by Eugenio Mininni (Mixkit)"],
    media: media("power-of-one-frame", "Extreme close-up of an eye under the title MAKE THEM FEEL IT, from The Power of One Frame cinematic short", [
      "A woman's face in dappled, warm light",
      "Rain-soaked city street at night lit by neon reflections",
      "Split-screen before-and-after colour grade on a portrait",
      "A woman smiling with her eyes closed, holding yellow flowers",
    ]),
    story: {
      overview:
        "A 68-second film that argues for the power of a single frame — and tries to prove it with every cut.",
      challenge:
        "Make a case for editing using nothing but editing. No product, no client message: the film has to earn attention on its own in about a minute.",
      concept:
        "One idea per beat — FEEL. FRAMES. RHYTHM. DETAILS. — each set over an image that embodies it: an eye, breaking surf, a city at night, a watch movement.",
      edit:
        "Built in six voiced blocks. Key words in the narration are pinned to the exact frame where the type lands, and the cut breathes in a held dip before the final line.",
      motion:
        "Restrained condensed titles, plus a mock edit-suite sequence — timeline, colour wheels, curves — that shows the work behind the picture.",
      sound:
        "Voiceover over a restructured music edit: the full entry, the dip and the closing slam are each moved to land on a story beat.",
      color:
        "Shot-by-shot exposure and white-balance matching, then four looks — night, warm, epic and craft — with gentle halation. Mastered in 4K at 24 fps.",
    },
  },
  {
    slug: "codevibe-saas-brand-film",
    title: "From First Idea to Production",
    subtitle: "Your next big idea deserves more than just code.",
    brand: "Codevibe",
    context: "SaaS brand film for Codevibe",
    date: "2026-10-24",
    categories: ["SaaS & Product Videos", "Motion Graphics", "Brand Films"],
    format: "16:9",
    duration: 58,
    summary:
      "A 58-second SaaS-style brand film for Codevibe, built from the studio's real website, screens and brand system — mastered in 4K.",
    role: ["Concept", "Motion design", "UI animation", "Editing", "Sound design"],
    tools: [],
    credits: ["Music: “Your Breath” by Eugenio Mininni (Mixkit)", "Sound effects: custom-designed", "Interface: Codevibe's own website and screens"],
    media: media("codevibe-saas-film", "WE TURN IDEAS INTO DIGITAL PRODUCTS THAT SCALE beside floating Codevibe website and phone screens on dark navy", [
      "Three phone screens showing analytics and checkout for the Mobile Applications chapter",
      "An AI processing node pulling in emails, forms, documents and spreadsheets for the AI & Automation chapter",
      "Type specimen, colour swatches and a Launch day card for the UI/UX Design chapter",
      "Codevibe website and case-study screens floating in depth around a soft blue glow",
    ]),
    story: {
      overview:
        "A premium SaaS-style film that walks through what Codevibe builds — web, mobile, AI, cloud and design — and how it works with clients, in under a minute.",
      challenge:
        "Make a services company feel like a product. Five services and a full delivery process had to read clearly in 58 seconds without turning into a slideshow.",
      concept:
        "Everything is real: the fonts, colours and screens come straight from codevibe.in. Floating browser and phone panels, a single glowing trace line and numbered chapters give it the calm confidence of a product launch film.",
      edit:
        "Six acts: the hook, the promise, five service chapters (01–05), the working principles, the journey from first idea to production, and the logo lock-up with a call to action.",
      motion:
        "Panels assemble in 3D depth, interface elements animate the way the real product would, and every headline reveals line by line in Space Grotesk.",
      sound:
        "A 120 bpm track re-mapped to the edit — a pulse for the hook, a breakdown for the principles, a re-entry for the journey and a clean resolve on the logo — plus custom interface sounds for ticks, traces and confirmations.",
      color:
        "Codevibe's own navy, blue and teal. Soft glows and deep navy gradients keep it premium and readable at any size. Mastered in 4K.",
    },
  },
  {
    slug: "toalt-travel-beyond-the-brochure",
    title: "Travel Beyond the Brochure",
    subtitle: "Arrive solo. Leave with a crew.",
    brand: "TOALT",
    context: "Brand film for TOALT",
    date: "2026-10-18",
    categories: ["Brand Films", "Travel Films", "Cinematic Storytelling"],
    format: "16:9",
    duration: 37,
    summary:
      "A 37-second brand film for TOALT that follows one idea — you can travel alone and still come home with a crew.",
    role: ["Editing", "Story structure", "Typography", "Sound design", "Color grading"],
    tools: [],
    credits: ["Footage: licensed stock", "Music: “Safar” by Bayaan & Sherazam (supplied by the client)"],
    media: media("toalt-brand-film", "Aerial shot of a lone vehicle on the road through Zanskar Valley, Ladakh, from the TOALT brand film", [
      "Aerial view of the Nine Arch Bridge in Ella, Sri Lanka, surrounded by jungle",
      "A polaroid frame titled the table of strangers over an outdoor group dinner",
      "Friends laughing in a convertible on an open road",
      "Silhouetted travellers at sunset under the title Arrive solo, leave with a crew",
    ]),
    story: {
      overview:
        "TOALT runs group trips for people who travel solo. The film had to make that promise feel real in under 40 seconds.",
      challenge:
        "Show a journey from stranger to friend without dialogue, using footage from different places and people, and keep it unmistakably on-brand.",
      concept:
        "A three-act arc — alone, together, a crew — carried by TOALT's own lines: “You don't need someone to go with.” “Strangers today.” “The table of strangers.”",
      edit:
        "Every shot holds for at least two beats so the destinations can breathe. Location tags pin each place — Zanskar Valley, Nine Arch Bridge — to the map.",
      motion:
        "Brand typography in three voices: serif italics for feeling, handwritten notes for warmth, and a bold sans for the payoff line and logo lock.",
      sound:
        "The client's chosen track, re-edited so the full band enters on “Arrive solo” and the final hit lands exactly on the logo.",
      color:
        "Per-shot matching from measured shot statistics, then a filmic S-curve, split toning, halation and grain to unify stock from many sources.",
    },
  },
  {
    slug: "stop-scrolling",
    title: "Stop Scrolling.",
    subtitle: "Your brand. Unmissable.",
    context: "Self-initiated typography film",
    date: "2026-10-22",
    categories: ["Kinetic Typography", "Social Media Videos"],
    format: "16:9",
    duration: 21,
    summary:
      "A 21-second kinetic typography film built for the X timeline — no footage, just words that refuse to be scrolled past.",
    role: ["Concept", "Typography", "Motion design", "Sound design"],
    tools: [],
    credits: ["Music: “Cyberpunk City” (Mixkit)", "Impacts: custom-designed"],
    media: media("kinetic-type-film", "The words YOUR BRAND. UNMISSABLE. in heavy white condensed type with orange full stops", [
      "ORDINARY IS INVISIBLE, with the last word dissolving as it is typed",
      "MAKE IT BOLD rendered as extruded three-dimensional letters",
      "KINETIC TYPOGRAPHY set large over a field of repeating smaller words",
      "The word VISUAL being cut apart inside an orange outline frame",
    ]),
    story: {
      overview: "A typography-only film designed to stop a thumb mid-scroll on X.",
      challenge:
        "Hold attention for 21 seconds with no footage, no people and no product — only type, timing and sound.",
      concept:
        "Black, white and one orange. Each phrase gets its own physical behaviour: it slams, glitches out, extrudes into 3D or smears with speed.",
      edit: "Scene changes sit on a 99.5 bpm grid, so every cut lands on the beat and the film feels inevitable rather than busy.",
      motion:
        "Letters are animated individually but laid out from real glyph metrics, so kerning holds while they move. Motion blur appears only on fast frames.",
      sound:
        "A driving track plus custom-designed impacts on every slam; the music cuts hard into silence at the end card.",
      color: "A strict three-colour system — near-black, white and signal orange — so the full stops do the shouting.",
    },
  },
  {
    slug: "toalt-trips-are-live",
    title: "Trips Are Now Live",
    subtitle: "Go solo. Find your crew.",
    brand: "TOALT",
    context: "Launch reel for TOALT",
    date: "2026-10-19",
    categories: ["Social Media Videos", "Travel Films"],
    format: "9:16",
    duration: 33.6,
    summary:
      "A vertical launch reel for TOALT, cut from real traveller footage, announcing that its trips are open for booking.",
    role: ["Editing", "Kinetic titles", "Sound design"],
    tools: [],
    credits: ["Footage: traveller clips supplied by the client", "Music: “Uplifting Bass” (Mixkit)"],
    media: media("toalt-trips-live", "A woman with arms outstretched on a red cliff above the sea under the words GO SOLO", [
      "Two friends laughing and posing outside a café under the words find your CREW",
      "A traveller at a waterfall viewpoint under the words THE WORLD is waiting",
      "Aerial view of a road curving around a green island under YOUR NEXT ADVENTURE",
      "The TOALT logo on a dark end card with the line Find your next adventure",
    ]),
    story: {
      overview: "A 34-second announcement reel for Instagram: TOALT's trips are live, and this is who goes on them.",
      challenge:
        "Raw vlog clips with burned-in captions, light leaks and mixed quality — they needed to feel like one confident launch.",
      concept:
        "Keep the most human moment. The reel opens on a traveller's own voice — “Ok listen, listen!” — before the music takes over.",
      edit:
        "The music drop starts the instant her voice ends, and a second drop is re-cut into the track on a bar line to land on “Live on TOALT.”",
      motion: "Short, punchy kinetic titles that sit in the safe areas and cover the source's old captions.",
      sound: "Original clip audio for the hook, then a bass-driven track edited for two drops in under 35 seconds.",
    },
  },
  {
    slug: "agency-science",
    title: "Agency Science",
    subtitle: "Start + Scale + Sustain = Agency.",
    context: "Motion design film",
    date: "2026-10-10",
    categories: ["Motion Graphics", "Kinetic Typography"],
    format: "16:9",
    duration: 22,
    summary:
      "A lab-notebook motion piece that turns “starting, scaling and sustaining a seven-figure agency” into a formula.",
    role: ["Concept", "Motion design", "Typography"],
    tools: [],
    credits: [],
    media: media("agency-science", "Periodic-table style tiles St plus Sc plus Su equals Ag above the words into a science", [
      "The word Starting beside an orange signal at the centre of a target reticle",
      "The word Scaling beside a revenue chart as an orange point starts to climb",
      "The word Sustaining beside an orange nucleus in a stable orbit",
      "A full-frame orange wash with a large revenue figure in black",
    ]),
    story: {
      overview:
        "A 22-second film that treats agency growth like an experiment — measured, repeatable, predictable.",
      concept:
        "Graph paper, specimen tiles and one orange signal. The signal travels from origin to growth curve to stable orbit, floods the frame, then resolves into St + Sc + Su = Ag.",
      edit:
        "Three phases — initiation, acceleration, equilibrium — each with its own visual model, so the story reads even with the sound off.",
      motion:
        "Animated at 60 fps for smooth orbits and counters. One layout system drives both the 16:9 and 9:16 versions.",
      color: "Ink, bone and a single signal orange; a clean sans for data, mono for lab notes and an italic serif for “science.”",
    },
  },
  {
    slug: "codevibe-build-your-next-advantage",
    title: "Build Your Next Advantage",
    subtitle: "Code that moves business forward.",
    brand: "Codevibe",
    context: "Brand reel for Codevibe",
    date: "2026-10-18",
    categories: ["Brand Films", "Social Media Videos", "Motion Graphics"],
    format: "9:16",
    duration: 30,
    summary:
      "A 30-second vertical brand reel for Codevibe that mixes live action, voiceover and animated website UI.",
    role: ["Editing", "Motion design", "Voiceover direction", "Sound design"],
    tools: [],
    credits: ["Footage: licensed stock", "Music: “Sci-Fi Score” (Mixkit)"],
    media: media("codevibe-advantage", "A man in glasses lit by green code under the line your website is either WINNING", [
      "The word UNFORGETTABLE sliding through frame above the label First impression",
      "A floating website mock-up titled Your business, beautifully online",
      "The words DIGITAL EXPERIENCES under a phone mock-up surrounded by interface cards",
      "The Codevibe logo resolving as the closing line begins",
    ]),
    story: {
      overview: "A brand reel that makes a web studio's pitch in 30 seconds: your website is either winning customers or losing them.",
      challenge: "Explain a service business emotionally, in vertical format, without turning into a feature list.",
      concept:
        "Open on a person, then move into the product: live action hands over to floating, animated website UI that builds itself across devices.",
      edit: "The cut follows a narrated script, with key words anchored to the moments the visuals change.",
      motion:
        "The Codevibe mark rebuilt as clean vector strokes, the brand's navy-and-blue system, and UI cards that assemble in depth.",
      sound: "An Indian-English voiceover over a cinematic score, edited on its beat grid.",
    },
  },
  {
    slug: "codevibe-typography-reel",
    title: "Code That Moves Business Forward",
    subtitle: "Your vision. Our engineering.",
    brand: "Codevibe",
    context: "Typography reel for Codevibe",
    date: "2026-10-22",
    categories: ["Kinetic Typography", "Social Media Videos"],
    format: "9:16",
    duration: 45,
    summary:
      "A 45-second typography-only reel for Codevibe, timed beat-for-beat to a 121 bpm groove.",
    role: ["Typography", "Motion design", "Music selection & edit"],
    tools: [],
    credits: ["Music: “Hazy After Hours” (Mixkit)"],
    media: media("codevibe-type", "YOUR VISION. OUR ENGINEERING. ONE SHARED GOAL. in white and blue type on dark navy", [
      "YOUR BUSINESS. in bold white type with a blue full stop",
      "BIG IDEAS assembling letter by letter",
      "AI & AUTOMATION with the line Intelligent systems. Measurable outcomes.",
      "The Codevibe logo above the call to action LET'S BUILD SOMETHING",
    ]),
    story: {
      overview: "A pure-type reel that lays out what Codevibe builds and why, one phrase at a time.",
      challenge: "Keep 45 seconds of text engaging on Instagram — long enough to say something, short enough to finish.",
      concept: "Calm navy, white type and a single blue accent. Each scene gets one idea and a clear rhythm.",
      edit:
        "The music was chosen by profiling eleven candidate tracks. The drop lands on the first big word; the outro's accents trigger the logo, the question and the call to action.",
      motion: "Glitch reveals, counters and orbiting words — and no unnecessary motion blur, so every letter stays crisp.",
      sound: "A 121 bpm groove with a quiet intro, a steady body and a composed outro spliced on a bar line.",
    },
  },
  {
    slug: "ui-motion-reel",
    title: "Make Every Interaction Feel Effortless",
    subtitle: "Designed to feel different.",
    context: "Self-initiated UI motion reel",
    date: "2026-10-18",
    categories: ["Motion Graphics", "SaaS & Product Videos"],
    format: "16:9",
    duration: 27,
    summary:
      "A product-animation reel: a dark analytics dashboard designed, then brought to life through hover, press and notify states.",
    role: ["UI design", "Product animation", "Motion design"],
    tools: [],
    credits: [],
    media: media("ui-motion-reel", "A dark analytics dashboard with charts and metric cards in violet", [
      "The headline GOOD DESIGN GETS ATTENTION. with a violet light line",
      "A glowing violet Generate report button being pressed",
      "The dashboard tilted in perspective as the camera pulls back",
      "End card: DESIGNED TO FEEL DIFFERENT. with the role line UI motion, product animation, motion design",
    ]),
    story: {
      overview: "A reel that shows how motion makes software feel considered — micro-interactions first, spectacle second.",
      concept: "One fictional workspace dashboard, explored the way a user would: hover, press, wait, get notified.",
      edit: "Short chapters, each introduced by a numbered label — hover & press, notify — then a 3D pull-back reveals the whole product.",
      motion: "Spring-based button states, live chart draws, toast notifications and a perspective camera move across the UI.",
      color: "Near-black surfaces, soft violet accents and restrained glow — premium without noise.",
    },
  },
  {
    slug: "codevibe-pitch-film",
    title: "Websites That Work",
    subtitle: "Most business websites fail for one reason.",
    brand: "Codevibe",
    context: "Pitch film for Codevibe",
    date: "2026-06-12",
    categories: ["Motion Graphics", "Brand Films", "SaaS & Product Videos"],
    format: "16:9",
    duration: 35,
    summary:
      "A widescreen explainer for Codevibe: problem, proof, transformation, ask — told entirely in animated interface.",
    role: ["Motion design", "Information design", "Editing"],
    tools: [],
    credits: [],
    media: media("codevibe-pitch", "An animated page-speed gauge reading 89 beside the words Page Speed", [
      "The line Most business websites fail for this reason beside a slow-loading laptop",
      "A laptop showing a travel website with an Incredible India banner",
      "A checklist titled Built to be found with search and performance items",
      "Before and after bar chart under the headline Built for conversions",
    ]),
    story: {
      overview: "A 35-second pitch film that walks a business owner from a slow website to a fast, findable one.",
      concept: "Four beats with on-screen chapter markers — the problem, the proof, the transformation, the ask.",
      edit: "Each beat gets one hero visual: a stalled loader, a live site, a speed gauge, a checklist, a chart.",
      motion: "Gauges, counters and checklists animate as data rather than decoration, so the argument reads at a glance.",
      color: "Codevibe navy with pink, lime and blue signals that colour-code bad, good and brand.",
    },
  },
  {
    slug: "codevibe-the-future-is-digital",
    title: "The Future Is Digital",
    subtitle: "Design. Development. Innovation.",
    brand: "Codevibe",
    context: "Social reel for Codevibe",
    date: "2026-05-14",
    categories: ["Motion Graphics", "Social Media Videos"],
    format: "9:16",
    duration: 25,
    summary: "A neon-lit vertical reel for Codevibe built from glowing type, HUD framing and the brand mark.",
    role: ["Motion design", "Typography"],
    tools: [],
    credits: [],
    media: media("codevibe-future", "WE BUILD DIGITAL EXPERIENCES in glowing type above a phone outline", [
      "The Codevibe mark glowing blue above THE FUTURE IS DIGITAL",
      "The word DESIGN glowing alone at the centre of a HUD frame",
      "BUILT TO GO VIRAL. with the line Attention is the new currency.",
      "The Codevibe logo with codevibe.in and CREATE, SCALE, DOMINATE",
    ]),
    story: {
      overview: "A 25-second social reel that introduces Codevibe in three words: design, development, innovation.",
      concept: "A dark, screen-lit world — HUD corners, status readouts and type that glows like it is being rendered live.",
      motion: "Words light up one at a time as the previous ones dim, so the eye always knows where to look.",
      color: "Deep navy with electric blue and teal bloom.",
    },
  },
  {
    slug: "codevibe-we-build-the-modern-web",
    title: "We Build the Modern Web",
    subtitle: "Your web, shipped fast.",
    brand: "Codevibe",
    context: "Services reel for Codevibe",
    date: "2026-05-14",
    categories: ["Motion Graphics", "Social Media Videos"],
    format: "9:16",
    duration: 35,
    summary: "A vertical services menu for Codevibe — frontend, backend, commerce and landing pages, one card at a time.",
    role: ["Motion design", "Typography", "Layout"],
    tools: [],
    credits: [],
    media: media("codevibe-web", "we build the modern web. in large white and blue type on a navy gradient", [
      "frontend. with the line interfaces that feel alive, and a large outlined 01",
      "backend & APIs. with technology tags such as Node.js, Go and PostgreSQL",
      "commerce & CMS. with the line shopify, wordpress, headless, custom",
      "your web, shipped fast. with fast. highlighted in yellow",
    ]),
    story: {
      overview: "A 35-second reel that turns a services list into something people watch to the end.",
      concept: "A numbered card system — 01 to 05 — with oversized outlined numerals, tech tags and a progress indicator.",
      motion: "Cards slide on a consistent rhythm while tags pop in sequence; the finale lands a highlighter swipe on “fast.”",
      color: "Navy-to-teal gradients with blue, teal and a single yellow highlight for the payoff.",
    },
  },
];

export const publishedProjects = projects.filter((p) => !p.placeholder);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Next project in list order, wrapping around. */
export function nextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export function formatDuration(seconds: number) {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** ISO 8601 duration for structured data, e.g. PT1M8S. */
export function isoDuration(seconds: number) {
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  return `PT${m ? `${m}M` : ""}${s % 60}S`;
}

export const storySections: { key: keyof Project["story"]; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "challenge", label: "Creative challenge" },
  { key: "concept", label: "Visual concept" },
  { key: "edit", label: "Editing & storytelling" },
  { key: "motion", label: "Motion & typography" },
  { key: "sound", label: "Sound & music" },
  { key: "color", label: "Color grading" },
];
