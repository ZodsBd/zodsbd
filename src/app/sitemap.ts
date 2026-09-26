import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { POLICIES } from "@/lib/content";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts] = await Promise.all([
    prisma.product.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);
  const staticPaths = ["", "/shop", "/journal", "/about", "/contact", "/faq", "/track", ...Object.keys(POLICIES).map((p) => `/policies/${p}`)];
  return [
    ...staticPaths.map((p) => ({ url: siteUrl(p || "/"), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.6 })),
    ...categories.map((c) => ({ url: siteUrl(`/category/${c.slug}`), lastModified: c.updatedAt, priority: 0.8 })),
    ...products.map((p) => ({ url: siteUrl(`/product/${p.slug}`), lastModified: p.updatedAt, priority: 0.9 })),
    ...posts.map((p) => ({ url: siteUrl(`/journal/${p.slug}`), lastModified: p.updatedAt, priority: 0.5 })),
  ];
}
