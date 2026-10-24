import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [anton, poster] = await Promise.all([
    readFile(join(process.cwd(), "assets/Anton-Regular.ttf")),
    readFile(join(process.cwd(), "public", site.hero.poster)),
  ]);
  const bg = `data:image/jpeg;base64,${poster.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0a0a0a" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bg} alt="" width={1200} height={675} style={{ position: "absolute", top: -22, left: 0, opacity: 0.38 }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
            fontFamily: "Anton",
            color: "#eeeae2",
          }}
        >
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", fontSize: 28, letterSpacing: 2 }}>
            <span>{site.wordmark}®</span>
            <span style={{ color: "#ff5a1f" }}>PORTFOLIO</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 118, lineHeight: 0.92 }}>
            {site.hero.lines.map((line, i) => (
              <span key={i} style={{ display: "flex", textTransform: "uppercase" }}>
                {i === site.hero.lines.length - 1 ? line.replace(/\.$/, "") : line}
                {i === site.hero.lines.length - 1 && <span style={{ color: "#ff5a1f" }}>.</span>}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 3, color: "#b8b3aa" }}>
            {site.title.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Anton", data: anton, style: "normal", weight: 400 }] },
  );
}
