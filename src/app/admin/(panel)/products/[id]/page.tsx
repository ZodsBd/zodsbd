import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AdminPage } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Edit product" };

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [p, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { sortOrder: "asc" } }, variants: { orderBy: { sortOrder: "asc" } } } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true, slug: true } }),
  ]);
  if (!p) notFound();
  return (
    <AdminPage title={p.name} actions={<Button asChild variant="outline" size="sm"><Link href={`/product/${p.slug}`} target="_blank"><ExternalLink />View</Link></Button>}>
      <ProductForm id={p.id} categories={categories} initial={{
        name: p.name, slug: p.slug, shortDescription: p.shortDescription ?? "", description: p.description, categoryId: p.categoryId,
        tags: p.tags, specs: (Array.isArray(p.specs) ? p.specs : []) as { label: string; value: string }[], status: p.status,
        isFeatured: p.isFeatured, isBestseller: p.isBestseller, colorLabel: p.colorLabel, sizeLabel: p.sizeLabel, sizeGuide: (p.sizeGuide as "belt" | "backpack" | null) ?? null,
        images: p.images.map((i) => ({ url: i.url, alt: i.alt ?? undefined })),
        variants: p.variants.map((v) => ({ id: v.id, sku: v.sku, color: v.color, size: v.size, price: v.price, compareAtPrice: v.compareAtPrice, stock: v.stock, imageUrl: v.imageUrl })),
      }} />
    </AdminPage>
  );
}
