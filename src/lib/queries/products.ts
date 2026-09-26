import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { PAGE_SIZE } from "../constants";

export const cardSelect = {
  id: true, name: true, slug: true, minPrice: true, minCompareAt: true, onSale: true,
  totalStock: true, ratingAvg: true, ratingCount: true, createdAt: true,
  category: { select: { name: true, slug: true } },
  images: { select: { url: true, alt: true }, orderBy: { sortOrder: "asc" }, take: 2 },
  variants: { select: { id: true, color: true, size: true, price: true, compareAtPrice: true, stock: true, imageUrl: true }, orderBy: { sortOrder: "asc" } },
} satisfies Prisma.ProductSelect;

export type ProductCardData = Prisma.ProductGetPayload<{ select: typeof cardSelect }>;

export type ShopParams = {
  category?: string;
  q?: string;
  min?: number;
  max?: number;
  color?: string[];
  size?: string[];
  inStock?: boolean;
  onSale?: boolean;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
  page?: number;
};

export function parseShopParams(sp: Record<string, string | string[] | undefined>): ShopParams {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string | undefined));
  const many = (k: string) => {
    const v = sp[k];
    if (!v) return undefined;
    return (Array.isArray(v) ? v : v.split(",")).filter(Boolean);
  };
  const num = (k: string) => {
    const v = Number(one(k));
    return Number.isFinite(v) && v > 0 ? v : undefined;
  };
  const sort = one("sort");
  return {
    category: one("category"),
    q: one("q")?.slice(0, 80),
    min: num("min"),
    max: num("max"),
    color: many("color"),
    size: many("size"),
    inStock: one("inStock") === "1",
    onSale: one("onSale") === "1",
    sort: sort === "price-asc" || sort === "price-desc" || sort === "popular" ? sort : "newest",
    page: Math.max(1, Number(one("page")) || 1),
  };
}

export async function getShopProducts(p: ShopParams) {
  const variantFilter: Prisma.ProductVariantWhereInput = {};
  if (p.color?.length) variantFilter.color = { in: p.color };
  if (p.size?.length) variantFilter.size = { in: p.size };
  if (p.inStock && (p.color?.length || p.size?.length)) variantFilter.stock = { gt: 0 };

  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
    ...(p.category ? { category: { slug: p.category } } : {}),
    ...(p.q
      ? { OR: [{ name: { contains: p.q, mode: "insensitive" } }, { tags: { has: p.q.toLowerCase() } }, { description: { contains: p.q, mode: "insensitive" } }] }
      : {}),
    ...(p.min || p.max ? { minPrice: { ...(p.min ? { gte: p.min } : {}), ...(p.max ? { lte: p.max } : {}) } } : {}),
    ...(p.inStock ? { totalStock: { gt: 0 } } : {}),
    ...(p.onSale ? { onSale: true } : {}),
    ...(Object.keys(variantFilter).length ? { variants: { some: variantFilter } } : {}),
  };
  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    p.sort === "price-asc" ? [{ minPrice: "asc" }] :
    p.sort === "price-desc" ? [{ minPrice: "desc" }] :
    p.sort === "popular" ? [{ soldCount: "desc" }, { ratingCount: "desc" }] : [{ createdAt: "desc" }];

  const page = p.page ?? 1;
  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy: [...orderBy, { id: "asc" }], skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, select: cardSelect }),
    prisma.product.count({ where }),
  ]);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

/** Distinct colours / sizes for filter UI (optionally scoped to a category). */
export async function getFilterFacets(categorySlug?: string) {
  const variants = await prisma.productVariant.findMany({
    where: { product: { status: "ACTIVE", ...(categorySlug ? { category: { slug: categorySlug } } : {}) } },
    select: { color: true, size: true },
    distinct: ["color", "size"],
  });
  const colors = [...new Set(variants.map((v) => v.color).filter((x): x is string => !!x))].sort();
  const sizes = [...new Set(variants.map((v) => v.size).filter((x): x is string => !!x))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
  return { colors, sizes };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
      reviews: { where: { status: "APPROVED" }, orderBy: { createdAt: "desc" }, take: 30 },
    },
  });
}
export type ProductDetail = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;

export async function getRelated(productId: string, categoryId: string) {
  return prisma.product.findMany({
    where: { status: "ACTIVE", categoryId, id: { not: productId } },
    orderBy: { soldCount: "desc" },
    take: 8,
    select: cardSelect,
  });
}

export async function getHomeCollections() {
  const [newArrivals, bestsellers] = await Promise.all([
    prisma.product.findMany({ where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" }, take: 10, select: cardSelect }),
    prisma.product.findMany({ where: { status: "ACTIVE", isBestseller: true }, orderBy: { soldCount: "desc" }, take: 10, select: cardSelect }),
  ]);
  return { newArrivals, bestsellers };
}
