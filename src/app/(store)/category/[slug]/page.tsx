import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PageHeader } from "@/components/brand/section-heading";
import { ShopView } from "@/components/shop/shop-view";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { prisma } from "@/lib/prisma";

const getCategory = cache((slug: string) => prisma.category.findUnique({ where: { slug } }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await getCategory((await params).slug);
  if (!c) return {};
  return {
    title: c.name,
    description: c.description ?? `Shop ${c.name} at Zod's Bd — premium quality, cash on delivery across Bangladesh.`,
    alternates: { canonical: `/category/${c.slug}` },
    openGraph: c.image ? { images: [c.image] } : undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const c = await getCategory(slug);
  if (!c) notFound();
  const sp = await searchParams;
  return (
    <>
      <PageHeader eyebrow="Collection" title={c.name} intro={c.description ?? undefined} />
      <div className="container pt-6"><Breadcrumbs items={[{ name: "Shop", path: "/shop" }, { name: c.name, path: `/category/${c.slug}` }]} /></div>
      <ShopView searchParams={sp} categorySlug={c.slug} basePath={`/category/${c.slug}`} />
    </>
  );
}
