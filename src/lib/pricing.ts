import type { CouponType } from "@prisma/client";

export type CouponLike = {
  code: string;
  type: CouponType;
  value: number;
  minOrderValue: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: Date | string | null;
  isActive: boolean;
};

export type CouponCheck = { ok: true; discount: number } | { ok: false; error: string };

/** Shared by the server quote, the order API and the admin UI. */
export function evaluateCoupon(coupon: CouponLike | null, subtotal: number, now = new Date()): CouponCheck {
  if (!coupon || !coupon.isActive) return { ok: false, error: "Invalid coupon code" };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) return { ok: false, error: "This coupon has expired" };
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
    return { ok: false, error: "This coupon has reached its usage limit" };
  if (subtotal < coupon.minOrderValue)
    return { ok: false, error: `Minimum order of ৳${coupon.minOrderValue.toLocaleString("en-IN")} required` };
  let discount = coupon.type === "FIXED" ? coupon.value : Math.round((subtotal * coupon.value) / 100);
  if (coupon.type === "PERCENTAGE" && coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, subtotal);
  return { ok: true, discount };
}

export function computeTotals(subtotal: number, discount: number, shippingFee: number) {
  return { subtotal, discount, shippingFee, total: Math.max(0, subtotal - discount) + shippingFee };
}
