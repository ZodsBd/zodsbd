"use client";
import Link from "next/link";
import { useState } from "react";
import type { DeliveryZone } from "@prisma/client";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/brand/section-heading";
import { useCart, cartSubtotal } from "@/store/cart";
import { useHydrated } from "@/store/use-hydrated";
import { zoneLabel } from "@/lib/shipping";
import { useStore } from "@/components/store-provider";
import { CartLine } from "./cart-line";
import { CouponField } from "./coupon-field";
import { SummaryRows } from "./order-summary";
import { ZoneRadio } from "./zone-radio";
import { useQuote } from "./use-quote";

export function CartPageView() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const [zone, setZone] = useState<DeliveryZone>("INSIDE_DHAKA");
  const { quote } = useQuote(zone);
  const { rates } = useStore();

  if (!hydrated) return <div className="container min-h-[50vh] py-20" />;
  if (!items.length) {
    return (
      <div className="container flex min-h-[55vh] flex-col items-center justify-center gap-5 py-20 text-center">
        <ShoppingBag className="h-12 w-12 text-warm" />
        <h1 className="font-serif text-4xl">Your bag is empty</h1>
        <p className="text-warm-dark">Discover pieces made to be carried for years.</p>
        <Button asChild><Link href="/shop">Shop the collection</Link></Button>
      </div>
    );
  }
  const subtotal = quote?.subtotal ?? cartSubtotal(items);
  const discount = quote?.discount ?? 0;
  const shipping = quote?.shippingFee ?? rates[zone];
  const hasIssues = !!quote?.issues.length;
  return (
    <>
      <PageHeader title="Your Bag" />
      <div className="container grid gap-12 py-12 lg:grid-cols-[1fr_400px]">
        <section aria-label="Items">
          <ul className="divide-y divide-border border-y border-border">
            {items.map((i) => <CartLine key={i.variantId} item={i} line={quote?.lines.find((l) => l.variantId === i.variantId)} />)}
          </ul>
          <Link href="/shop" className="mt-6 inline-block text-xs uppercase tracking-[0.18em] underline underline-offset-4">Continue shopping</Link>
        </section>
        <aside className="h-fit space-y-6 bg-ivory p-6 md:p-8">
          <h2 className="font-serif text-2xl">Order Summary</h2>
          <CouponField error={quote?.couponError} />
          <ZoneRadio value={zone} onChange={setZone} name="cart-zone" />
          <SummaryRows subtotal={subtotal} discount={discount} shippingFee={shipping} total={subtotal - discount + shipping} couponCode={quote?.couponCode} shippingLabel={zoneLabel(zone)} />
          {hasIssues && <p role="alert" className="text-xs text-rose-700">{quote!.issues[0]}</p>}
          <Button asChild className="w-full" aria-disabled={hasIssues}><Link href={hasIssues ? "#" : "/checkout"}>Proceed to Checkout</Link></Button>
        </aside>
      </div>
    </>
  );
}
