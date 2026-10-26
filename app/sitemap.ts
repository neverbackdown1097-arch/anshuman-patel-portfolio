import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { publishedProjects } from "@/content/projects";
import { products } from "@/content/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = publishedProjects.map((p) => p.date).sort().at(-1);
  return [
    { url: site.url, lastModified: latest, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/work`, lastModified: latest, changeFrequency: "monthly", priority: 0.9 },
    ...products.map((p) => ({
      url: `${site.url}/products/${p.slug}`,
      lastModified: latest,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: [`${site.url}${p.media.poster}`],
    })),
    ...publishedProjects.map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "yearly" as const,
      priority: 0.8,
      images: [`${site.url}${p.media.poster}`],
      videos: [
        {
          title: p.title,
          thumbnail_loc: `${site.url}${p.media.poster}`,
          description: p.summary,
          content_loc: `${site.url}${p.media.film}`,
        },
      ],
    })),
  ];
}
