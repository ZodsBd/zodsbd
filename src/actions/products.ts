"use server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { productInputSchema, type ProductInput } from "@/lib/validators";
import { refreshProductAggregates } from "@/lib/product-aggregates";
import { slugify } from "@/lib/utils";

type Result = { ok: true; id: string } | { ok: false; error: string };

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = base || "product";
  for (let i = 2; ; i++) {
    const hit = await prisma.product.findFirst({ where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) }, select: { id: true } });
    if (!hit) return slug;
    slug = `${base}-${i}`;
  }
}

export async function saveProduct(id: string | null, input: ProductInput): Promise<Result> {
  await requireAdmin();
  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid product" };
  const d = parsed.data;
  const skus = d.variants.map((v) => v.sku.toUpperCase());
  if (new Set(skus).size !== skus.length) return { ok: false, error: "Each variant needs a unique SKU" };
  const combos = d.variants.map((v) => `${v.color ?? ""}|${v.size ?? ""}`);
  if (new Set(combos).size !== combos.length) return { ok: false, error: "Two variants have the same colour/size combination" };

  const slug = await uniqueSlug(slugify(d.slug || d.name), id ?? undefined);
  const base = {
    name: d.name, slug, shortDescription: d.shortDescription || null, description: d.description, categoryId: d.categoryId,
    tags: [...new Set(d.tags.map((t) => t.toLowerCase()))], specs: d.specs, status: d.status, isFeatured: d.isFeatured, isBestseller: d.isBestseller,
    colorLabel: d.colorLabel || null, sizeLabel: d.sizeLabel || null, sizeGuide: d.sizeGuide || null,
  };
  try {
    const productId = await prisma.$transaction(async (tx) => {
      const p = id ? await tx.product.update({ where: { id }, data: base }) : await tx.product.create({ data: base });
      await tx.productImage.deleteMany({ where: { productId: p.id } });
      if (d.images.length) await tx.productImage.createMany({ data: d.images.map((im, i) => ({ productId: p.id, url: im.url, alt: im.alt || d.name, sortOrder: i })) });

      const keepIds = d.variants.map((v) => v.id).filter((x): x is string => !!x);
      await tx.productVariant.deleteMany({ where: { productId: p.id, id: { notIn: keepIds } } });
      for (const [i, v] of d.variants.entries()) {
        const data = { sku: v.sku.toUpperCase(), color: v.color || null, size: v.size || null, price: v.price, compareAtPrice: v.compareAtPrice && v.compareAtPrice > v.price ? v.compareAtPrice : null, stock: v.stock, imageUrl: v.imageUrl || null, sortOrder: i };
        if (v.id) await tx.productVariant.update({ where: { id: v.id }, data });
        else await tx.productVariant.create({ data: { ...data, productId: p.id } });
      }
      await refreshProductAggregates(tx, p.id);
      return p.id;
    });
    revalidatePath("/", "layout");
    return { ok: true, id: productId };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return { ok: false, error: "A SKU is already used by another product" };
    console.error(e);
    return { ok: false, error: "Could not save product" };
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  // Order history keeps its snapshot (productId/variantId become null).
  await prisma.product.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function toggleProductStatus(id: string) {
  await requireAdmin();
  const p = await prisma.product.findUniqueOrThrow({ where: { id }, select: { status: true } });
  await prisma.product.update({ where: { id }, data: { status: p.status === "ACTIVE" ? "DRAFT" : "ACTIVE" } });
  revalidatePath("/", "layout");
}
