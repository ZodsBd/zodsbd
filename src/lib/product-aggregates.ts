import type { Prisma, PrismaClient } from "@prisma/client";

type Db = PrismaClient | Prisma.TransactionClient;

/** Recomputes stored price/stock/sale/rating fields used for fast filtering & sorting. */
export async function refreshProductAggregates(db: Db, productId: string) {
  const [variants, rating] = await Promise.all([
    db.productVariant.findMany({ where: { productId }, select: { price: true, compareAtPrice: true, stock: true } }),
    db.review.aggregate({ where: { productId, status: "APPROVED" }, _avg: { rating: true }, _count: true }),
  ]);
  const prices = variants.map((v) => v.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const cheapest = variants.find((v) => v.price === minPrice);
  await db.product.update({
    where: { id: productId },
    data: {
      minPrice,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      minCompareAt: cheapest?.compareAtPrice && cheapest.compareAtPrice > minPrice ? cheapest.compareAtPrice : null,
      onSale: variants.some((v) => v.compareAtPrice !== null && v.compareAtPrice > v.price),
      totalStock: variants.reduce((s, v) => s + Math.max(0, v.stock), 0),
      ratingAvg: rating._avg.rating ? Math.round(rating._avg.rating * 10) / 10 : 0,
      ratingCount: rating._count,
    },
  });
}
