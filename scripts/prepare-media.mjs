// Turns master renders into web-ready media under public/media.
//   node scripts/prepare-media.mjs            -> process every job below
//   node scripts/prepare-media.mjs toalt-film -> only that slug (or "hero")
// FFMPEG_PATH overrides the ffmpeg binary. Existing outputs are skipped;
// pass --force to rebuild them.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { tmpdir } from "node:os";

const FFMPEG =
  process.env.FFMPEG_PATH ??
  "G:/motion graphics/codevibe-reel-v3/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe";
const SRC = process.env.MEDIA_SOURCE ?? "G:/portfolio";
const OUT = resolve(import.meta.dirname, "../public/media");

// slug: { file, vertical, poster: seconds, stills: seconds[], preview: [start, length] }
const jobs = {
  "power-of-one-frame": { file: "the-power-of-one-frame-1080.mp4", poster: 55.6, stills: [8.6, 21.4, 33.6, 47.6], preview: [52.4, 6] },
  showreel: { file: "showreel-16x9.mp4", poster: 11.87, stills: [3.96, 6.59, 9.23, 14.5], preview: [8.6, 6] },
  "kinetic-type-film": { file: "kinetic-type-16x9.mp4", poster: 17.1, stills: [3.96, 6.59, 11.87, 14.5], preview: [0, 6] },
  "agency-science": { file: "agency-science-reel-16x9.mp4", poster: 17.9, stills: [1.38, 4.14, 9.65, 12.4], preview: [10.5, 6] },
  "ui-motion-reel": { file: "ui-motion-reel.mp4", poster: 5.07, stills: [1.69, 8.45, 15.2, 25.4], preview: [3, 6] },
  "codevibe-pitch": { file: "codevibe-pitch-reel-16x9.mp4", poster: 10.95, stills: [2.19, 6.57, 19.7, 24.1], preview: [8, 6] },
  "toalt-brand-film": { file: "toalt-film-16x9.mp4", poster: 6.96, stills: [11.6, 20.9, 26.2, 31.5], preview: [5, 6] },
  "toalt-trips-live": { file: "toalt-trips-live-v2.mp4", vertical: true, poster: 10.5, stills: [14.7, 18.9, 23.1, 31.5], preview: [9, 6] },
  "codevibe-advantage": { file: "codevibe-advantage-reel.mp4", vertical: true, poster: 1.875, stills: [9.4, 13.1, 20.6, 28.1], preview: [0, 6] },
  "codevibe-type": { file: "codevibe-type-9x16.mp4", vertical: true, poster: 31, stills: [2.8, 8.4, 19.7, 42.2], preview: [26, 6] },
  "codevibe-future": { file: "codevibe-future-reel.mp4", vertical: true, poster: 4.7, stills: [1.57, 7.8, 14.1, 23.5], preview: [0, 6] },
  "codevibe-web": { file: "codevibe-reel.mp4", vertical: true, poster: 6.57, stills: [10.95, 15.3, 19.7, 28.5], preview: [4, 6] },
  "codevibe-saas-film": { file: "G:/pf/codevibe-film-4k.mp4", poster: 10.5, stills: [15.5, 18.5, 24.5, 43.5], preview: [12, 6] },
  "own-the-elements": {
    file: "G:/motion graphics/codevibe-reel-v3/out/own-the-elements-ig.mp4",
    vertical: true,
    poster: 29.6,
    stills: [4.0, 11.6, 16.3, 19.3],
    preview: [3, 6],
  },
};

// Raw-vs-final breakdowns: slug → content/breakdowns/<slug>.json. Produces
// compare/<key>-raw.jpg + -final.jpg (same moment, 1080x1920), raw.mp4 (every
// source clip that made the cut, untouched, in edit order) and fills in the
// measured clip metadata (resolution, frame rate, durations) in the JSON.
const breakdowns = ["own-the-elements"];

// Text-free shots for the silent hero background loop: [file, start, length].
const hero = [
  ["the-power-of-one-frame-1080.mp4", 16.6, 1.5],
  ["the-power-of-one-frame-1080.mp4", 7, 1.2],
  ["the-power-of-one-frame-1080.mp4", 20, 0.8],
  ["the-power-of-one-frame-1080.mp4", 21.5, 0.8],
  ["the-power-of-one-frame-1080.mp4", 33.6, 1.5],
  ["toalt-film-16x9.mp4", 26.1, 1.2],
  ["the-power-of-one-frame-1080.mp4", 43.6, 1.5],
  ["toalt-film-16x9.mp4", 27.6, 1.2],
  ["the-power-of-one-frame-1080.mp4", 6, 0.6],
  ["the-power-of-one-frame-1080.mp4", 46.6, 1.1],
];

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));

function ff(...a) {
  const r = spawnSync(FFMPEG, ["-v", "error", "-y", ...a], { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${a.join(" ")}`);
}
const todo = (p) => force || !existsSync(p);

for (const [slug, j] of Object.entries(jobs)) {
  if (only.length && !only.includes(slug)) continue;
  const dir = join(OUT, slug);
  mkdirSync(dir, { recursive: true });
  const src = isAbsolute(j.file) ? j.file : join(SRC, j.file);
  const full = j.vertical ? "scale=1080:1920" : "scale=1920:1080";
  const small = j.vertical ? "scale=360:640" : "scale=640:360";
  console.log(`▸ ${slug}`);
  // Full film: H.264 high profile, faststart so playback begins before download ends.
  if (todo(join(dir, "film.mp4")))
    ff("-i", src, "-vf", full, "-r", "30", "-c:v", "libx264", "-preset", "slow", "-crf", "21",
      "-maxrate", "8M", "-bufsize", "16M", "-pix_fmt", "yuv420p", "-profile:v", "high",
      "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", join(dir, "film.mp4"));
  // Silent hover preview loop.
  if (todo(join(dir, "preview.mp4")))
    ff("-ss", String(j.preview[0]), "-t", String(j.preview[1]), "-i", src, "-vf", small, "-r", "30",
      "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p",
      "-movflags", "+faststart", join(dir, "preview.mp4"));
  // Poster + stills as high-quality JPEG; next/image derives AVIF/WebP sizes from these.
  const frames = [["poster", j.poster], ...j.stills.map((t, i) => [`still-${i + 1}`, t])];
  for (const [name, t] of frames) {
    const p = join(dir, `${name}.jpg`);
    if (todo(p)) ff("-ss", String(t), "-i", src, "-frames:v", "1", "-vf", full, "-q:v", "2", p);
  }
}

const FFPROBE = FFMPEG.replace(/ffmpeg(\.exe)?$/, "ffprobe$1");
function probe(file) {
  const r = spawnSync(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries",
    "stream=width,height,r_frame_rate:format=duration", "-of", "json", file], { encoding: "utf8" });
  const j = JSON.parse(r.stdout);
  const [n, d] = j.streams[0].r_frame_rate.split("/").map(Number);
  return { width: j.streams[0].width, height: j.streams[0].height, fps: Math.round((n / d) * 100) / 100, duration: Number(j.format.duration) };
}

for (const slug of breakdowns) {
  if (only.length && !only.includes(slug)) continue;
  console.log(`▸ ${slug} breakdown`);
  const cfgPath = resolve(import.meta.dirname, `../content/breakdowns/${slug}.json`);
  const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
  const dir = join(OUT, slug);
  const cmp = join(dir, "compare");
  mkdirSync(cmp, { recursive: true });
  const rawFile = (id) => join(cfg.rawDir, `${id}.mp4`);
  // Fill a 1080x1920 frame regardless of the source's exact vertical ratio.
  const fill = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920";

  for (const p of cfg.pairs) {
    const raw = join(cmp, `${p.key}-raw.jpg`);
    const fin = join(cmp, `${p.key}-final.jpg`);
    if (todo(raw)) ff("-ss", String(p.rawAt), "-i", rawFile(p.id), "-frames:v", "1", "-vf", fill, "-q:v", "3", raw);
    if (todo(fin)) ff("-ss", String(p.finalAt), "-i", cfg.final, "-frames:v", "1", "-vf", fill, "-q:v", "3", fin);
  }

  // Raw reel locked to the final's cut list: each shot is the untouched source
  // clip from its in-point, at native speed, for exactly that shot's length.
  // Shots with no source footage (id: null) are black.
  const montage = join(dir, "raw.mp4");
  if (todo(montage)) {
    const tmp = join(tmpdir(), `raw-${Date.now()}`);
    mkdirSync(tmp, { recursive: true });
    const enc = ["-r", "30", "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p"];
    const parts = cfg.clips.map((c, i) => {
      const p = join(tmp, `p${i}.mp4`);
      // Exact frame counts (not durations) so 25 shots add up to the final's length with no drift.
      const frames = ["-frames:v", String(c.to - c.from)];
      if (c.id)
        ff("-ss", String(c.start), "-i", rawFile(c.id),
          "-vf", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280", ...frames, ...enc, p);
      else ff("-loop", "1", "-framerate", "30", "-i", resolve(import.meta.dirname, "assets/black-720x1280.jpg"), ...frames, ...enc, p);
      return p;
    });
    const list = join(tmp, "list.txt");
    writeFileSync(list, parts.map((p) => `file '${p.replaceAll("\\", "/")}'`).join("\n"));
    ff("-f", "concat", "-safe", "0", "-i", list, "-c:v", "libx264", "-preset", "slow", "-crf", "26",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", montage);
    ff("-ss", "0.5", "-i", parts[0], "-frames:v", "1", "-vf", "scale=1080:1920", "-q:v", "3", join(dir, "raw-poster.jpg"));
    rmSync(tmp, { recursive: true, force: true });
  }

  // Measured facts for the page: every file delivered, and which ones were used.
  const delivered = readdirSync(cfg.rawDir).filter((f) => /\.(mp4|mov)$/i.test(f));
  const meta = Object.fromEntries(delivered.map((f) => [f.replace(/\.\w+$/, ""), probe(join(cfg.rawDir, f))]));
  cfg.clips = cfg.clips.map((c) => ({ ...c, ...pick(meta[c.id]) }));
  cfg.stats = {
    delivered: delivered.length,
    used: new Set(cfg.clips.map((c) => c.id).filter(Boolean)).size,
    shots: cfg.clips.length,
    rawSeconds: Math.round(Object.values(meta).reduce((s, m) => s + m.duration, 0)),
    finalSeconds: Math.round(probe(cfg.final).duration * 10) / 10,
  };
  writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + "\n");
}
function pick(m) {
  return m ? { width: m.width, height: m.height, fps: m.fps } : {};
}

if (!only.length || only.includes("hero")) {
  const dir = join(OUT, "hero");
  mkdirSync(dir, { recursive: true });
  console.log("▸ hero");
  const tmp = join(tmpdir(), `hero-${Date.now()}`);
  mkdirSync(tmp, { recursive: true });
  const parts = hero.map(([file, ss, t], i) => {
    const p = join(tmp, `p${i}.mp4`);
    ff("-ss", String(ss), "-t", String(t), "-i", join(SRC, file), "-vf", "scale=1920:1080", "-r", "30",
      "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-pix_fmt", "yuv420p", p);
    return p;
  });
  const list = join(tmp, "list.txt");
  writeFileSync(list, parts.map((p) => `file '${p.replaceAll("\\", "/")}'`).join("\n"));
  for (const [name, scale, crf] of [["hero.mp4", "1600:900", "30"], ["hero-mobile.mp4", "960:540", "31"]])
    ff("-f", "concat", "-safe", "0", "-i", list, "-vf", `scale=${scale}`, "-an", "-c:v", "libx264",
      "-preset", "slow", "-crf", crf, "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(dir, name));
  ff("-ss", "0.8", "-i", parts[0], "-frames:v", "1", "-q:v", "3", join(dir, "hero-poster.jpg"));
  rmSync(tmp, { recursive: true, force: true });
}
console.log("done");
