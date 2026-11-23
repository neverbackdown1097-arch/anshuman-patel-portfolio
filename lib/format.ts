/** Frame formats the site supports, with their Tailwind aspect classes and pixel sizes. */
export type Format = "16:9" | "9:16" | "4:3" | "4:5";

export const aspectClass: Record<Format, string> = {
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
  "4:3": "aspect-[4/3]",
  "4:5": "aspect-[4/5]",
};

export const frameSize: Record<Format, { width: number; height: number }> = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "4:3": { width: 1920, height: 1440 },
  "4:5": { width: 1080, height: 1350 },
};

/** Portrait frames (9:16 films and 4:5 posters) share the tall layouts. */
export const isVertical = (f: Format) => f === "9:16" || f === "4:5";
