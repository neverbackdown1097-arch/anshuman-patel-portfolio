# Anshuman Patel — Portfolio

A cinematic portfolio for a video editor and motion designer, built with Next.js 16, React 19, TypeScript, Tailwind CSS 4 and Motion.

```
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Where everything lives

| What | File |
| --- | --- |
| Name, bio, hero text, showreel, services, process, social links, SEO | `content/site.ts` |
| Projects and case studies | `content/projects.ts` |
| Video, posters and stills | `public/media/<slug>/` |
| Media encoding script | `scripts/prepare-media.mjs` |
| Contact form backend | `app/api/contact/route.ts` |
| Colours and fonts | `app/globals.css` (`@theme`) and `app/layout.tsx` |

You can update the site's content without touching any component.

## Adding a real project

1. Export the master render (H.264/ProRes, any size) into your media source folder. It defaults to `G:/portfolio`; set `MEDIA_SOURCE` to use a different folder.
2. In `scripts/prepare-media.mjs`, add a job to `jobs`:
   ```js
   "my-new-film": { file: "my-new-film.mp4", poster: 4.2, stills: [1.5, 8, 12.3, 20], preview: [6, 6] },
   ```
   `poster` and `stills` are timestamps in seconds. `preview` is `[start, length]` for the silent hover loop. Add `vertical: true` for 9:16 films.
3. Run `npm run media my-new-film`. This creates `public/media/my-new-film/` with:
   - `film.mp4`: web H.264 with faststart.
   - `preview.mp4`: a silent 6-second loop.
   - `poster.jpg` and `still-1…4.jpg`.

   The script uses the ffmpeg path in `FFMPEG_PATH` (or the default path written in the script). Add `--force` to rebuild existing files.
4. Copy an entry in `content/projects.ts`, then change `slug` and the copy, and pass the same folder name to `media("my-new-film", …)`. Write alt text that describes what is actually in each still.
5. The order of the `projects` array sets the order of the gallery, the index and the "next project" links.

Unfinished entries can be marked `placeholder: true`. They get a visible "Placeholder" tag and are kept out of the sitemap and structured data.

Each case-study section (`challenge`, `concept`, `edit`, `motion`, `sound`, `color`) is optional. A section you leave out is hidden. `tools` is empty for every project for now. Fill it in, e.g. `["Premiere Pro", "After Effects"]`, and a Tools row appears.

## Replacing videos

- **Showreel:** set `site.showreel.src` and `site.showreel.poster`. Any MP4 URL works, including Cloudflare R2, Bunny, Mux or a Vimeo Pro direct file link. If you set `src: ""`, the player shows a "coming soon" panel instead.
- **Hero background:** `site.hero.video`, `videoMobile` and `poster`. The loop is cut from text-free shots of *The Power of One Frame* and the TOALT film. You can change those shots in the `hero` list in `scripts/prepare-media.mjs`, then run `npm run media hero -- --force`.
- **Hosting films elsewhere:** the media fields in `projects.ts` also accept absolute URLs. If your traffic grows, consider moving the `film.mp4` files to a video CDN and keeping posters local.

## Social links and email

All links live in `site.social` in `content/site.ts`. A blank value (`""`) hides that link across the nav menu, contact section, footer and structured data. Vimeo and YouTube are blank for now, so they stay hidden until you add your own channel URLs.

## Connecting the contact form

The form posts to `/api/contact`, which validates the input and delivers it. If delivery fails for any reason, the form tells visitors their message was **not** sent and offers a pre-filled email instead. It never shows a fake success message.

**Default: FormSubmit (works with no setup).** Messages go to the email in `content/site.ts` (or `CONTACT_TO_EMAIL`). The first time it is used, FormSubmit emails you an **"Activate Form"** link. Click it once (check Spam too). Until then, messages are not delivered. Set `FORMSUBMIT_DISABLED=1` to turn it off.

For a branded sender or higher volume, use one of the options below instead. Set environment variables in your host (Vercel → Project → Settings → Environment Variables), or locally in `.env.local`. See `.env.example`. The first option configured wins.

**Option A: Resend (emails land directly in your inbox)**
1. Create a free account at resend.com, then verify a domain you own.
2. Set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (e.g. `Portfolio <hello@yourdomain.com>`) and, optionally, `CONTACT_TO_EMAIL`. It defaults to the email in `site.ts`.

**Option B: Formspree (no domain needed)**
1. Create a form at formspree.io. Its notification email should be `anshumanpatel619@gmail.com`.
2. Set `FORMSPREE_ENDPOINT` to the form URL, e.g. `https://formspree.io/f/abcdwxyz`.

Redeploy after you add the variables. To test, send yourself a message from the live site.

## Deploying (Vercel, free tier)

1. Push this folder to a GitHub repository. Every media file is under GitHub's 100 MB limit.
2. On vercel.com, choose **Add New → Project**, import the repo and keep the defaults.
3. Add the contact-form environment variables. Once you connect a custom domain, also set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` so that canonical URLs, Open Graph tags and the sitemap use it.
4. Deploy. On each push to `main`, Vercel builds and publishes again.

You can also deploy without GitHub: run `npx vercel` from this folder.

You can use any Node host that runs `next build && next start`, such as Netlify, Railway or Render. The site needs a Node runtime because of the contact API and the Proxy.

## SEO

- Every page has a unique title, description, canonical URL and Open Graph data.
- `/sitemap.xml` (including video entries), `/robots.txt` and a generated social preview image (`app/opengraph-image.tsx`).
- JSON-LD: `Person` and `WebSite` on the home page. Case studies get `VideoObject` and `BreadcrumbList`. All of it is built from your real details.
- Unknown `/work/*` URLs return a real 404 (see `proxy.ts`).

## Accessibility and motion

- The site has a skip link, semantic landmarks and headings, and visible focus rings.
- The mobile menu is a dialog with a focus trap and closes with Esc.
- The video player has full keyboard support: Space/K to play or pause, M to mute, F for fullscreen, ←/→ to seek.
- Under `prefers-reduced-motion`, the site skips transform animations, the hero loop (the poster shows instead), hover previews, parallax and the custom cursor. The hero loop is also skipped when Save-Data is on.
- Videos never autoplay with sound. The hero and hover previews are muted, and each player starts only when the visitor presses Play.
