import type { MetadataRoute } from "next";
import { legalDocuments } from "@/data/legal";
import { absoluteUrl } from "@/lib/seo";
import { getProductSlugs } from "@/services/catalog";
import { getStoreSlugs } from "@/services/stores";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, storeSlugs] = await Promise.all([getProductSlugs(), getStoreSlugs()]);
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/menu"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/stores"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/offers"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/faqs"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  return [
    ...statics,
    ...productSlugs.map((slug) => ({ url: absoluteUrl(`/menu/${slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...storeSlugs.map((slug) => ({ url: absoluteUrl(`/stores/${slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...legalDocuments.map((doc) => ({ url: absoluteUrl(`/legal/${doc.slug}`), lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
