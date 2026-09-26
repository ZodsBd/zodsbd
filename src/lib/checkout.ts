import type { DeliveryZone, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { evaluateCoupon } from "./pricing";
import { getShippingRates } from "./settings";
import { variantLabel } from "./utils";

type Line = { variantId: string; quantity: number };

/** Server-side re-pricing of a cart. Never trusts client prices. */
export async function quoteCart(items: Line[], zone: DeliveryZone, couponCode?: string, db: Prisma.TransactionClient | typeof prisma = prisma) {
  const merged = new Map<string, number>();
  items.forEach((i) => merged.set(i.variantId, (merged.get(i.variantId) ?? 0) + i.quantity));
  const ids = [...merged.keys()];
  const variants = await db.productVariant.findMany({
    where: { id: { in: ids } },
    include: { product: { select: { id: true, name: true, status: true, images: { take: 1, orderBy: { sortOrder: "asc" }, select: { url: true } } } } },
  });
  const issues: string[] = [];
  const lines = ids.map((id) => {
    const qty = merged.get(id)!;
    const v = variants.find((x) => x.id === id);
    const available = !!v && v.product.status === "ACTIVE" && v.stock > 0;
    if (!v || v.product.status !== "ACTIVE") issues.push("An item in your bag is no longer available.");
    else if (v.stock < qty) issues.push(`${v.product.name}${variantLabel(v) ? ` (${variantLabel(v)})` : ""}: only ${v.stock} left.`);
    return {
      variantId: id,
      available,
      stock: v?.stock ?? 0,
      price: v?.price ?? 0,
      compareAtPrice: v?.compareAtPrice ?? null,
      quantity: qty,
      lineTotal: (v?.price ?? 0) * qty,
      variant: v,
    };
  });
  const subtotal = lines.filter((l) => l.available).reduce((s, l) => s + l.lineTotal, 0);

  let discount = 0;
  let couponError: string | null = null;
  let coupon: Awaited<ReturnType<typeof db.coupon.findUnique>> = null;
  const code = couponCode?.trim().toUpperCase();
  if (code) {
    coupon = await db.coupon.findUnique({ where: { code } });
    const res = evaluateCoupon(coupon, subtotal);
    if (res.ok) discount = res.discount;
    else { couponError = res.error; coupon = null; }
  }
  const rates = await getShippingRates();
  const shippingFee = rates[zone];
  return {
    lines,
    subtotal,
    discount,
    shippingFee,
    total: subtotal - discount + shippingFee,
    coupon,
    couponCode: coupon ? coupon.code : null,
    couponError,
    issues: [...new Set(issues)],
  };
}

export function publicQuote(q: Awaited<ReturnType<typeof quoteCart>>) {
  return {
    lines: q.lines.map((l) => ({ variantId: l.variantId, available: l.available, stock: l.stock, price: l.price, compareAtPrice: l.compareAtPrice, quantity: l.quantity, lineTotal: l.lineTotal })),
    subtotal: q.subtotal, discount: q.discount, shippingFee: q.shippingFee, total: q.total,
    couponCode: q.couponCode, couponError: q.couponError, issues: q.issues,
  };
}
