"use client";
import { useEffect, useRef, useState } from "react";
import type { DeliveryZone } from "@prisma/client";
import { useCart } from "@/store/cart";

export type QuoteLine = { variantId: string; available: boolean; stock: number; price: number; compareAtPrice: number | null; quantity: number; lineTotal: number };
export type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode: string | null;
  couponError: string | null;
  issues: string[];
};

/** Server-authoritative price/stock/coupon/shipping quote for the current cart. */
export function useQuote(zone: DeliveryZone) {
  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.couponCode);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const reqId = useRef(0);

  const key = JSON.stringify({ i: items.map((i) => [i.variantId, i.quantity]), couponCode, zone });

  useEffect(() => {
    if (!items.length) { setQuote(null); return; }
    const id = ++reqId.current;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/cart/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })), couponCode: couponCode ?? undefined, zone }),
        });
        const data = (await res.json()) as Quote;
        if (id === reqId.current && res.ok) {
          setQuote(data);
          // keep local cart in sync with live prices / stock
          const st = useCart.getState();
          data.lines.forEach((l) => {
            const local = st.items.find((x) => x.variantId === l.variantId);
            if (local && (local.price !== l.price || local.maxStock !== l.stock)) {
              useCart.setState((s) => ({
                items: s.items.map((x) => (x.variantId === l.variantId ? { ...x, price: l.price, compareAtPrice: l.compareAtPrice, maxStock: l.stock } : x)),
              }));
            }
          });
        }
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { quote, loading };
}
