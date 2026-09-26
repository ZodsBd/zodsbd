import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { OrderSummaryCard } from "@/components/order/order-summary-card";
import { Button } from "@/components/ui/button";
import { getOrderByNumber } from "@/lib/queries/orders";
import { normalizePhone } from "@/lib/phone";

export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function OrderConfirmation({ params, searchParams }: { params: Promise<{ orderNumber: string }>; searchParams: Promise<{ phone?: string }> }) {
  const { orderNumber } = await params;
  const { phone } = await searchParams;
  const order = await getOrderByNumber(orderNumber.toUpperCase());
  // phone acts as a lightweight access key so order details aren't guessable
  if (!order || !phone || normalizePhone(phone) !== order.phone) notFound();
  return (
    <div className="container max-w-3xl py-14 md:py-20">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold" strokeWidth={1.25} />
        <p className="eyebrow mt-6">Thank you, {order.customerName.split(" ")[0]}</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Your order is confirmed</h1>
        <div className="mx-auto mt-8 max-w-md border border-gold bg-ivory px-6 py-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-warm-dark">Order number</p>
          <p className="mt-1 font-serif text-3xl tracking-wider">{order.orderNumber}</p>
          <p className="mt-2 text-sm text-gold-dark">Save this number to track your order.</p>
        </div>
        <p className="mx-auto mt-6 max-w-md text-sm text-warm-dark">Our team will call you on {order.phone} to confirm. Please keep {order.total.toLocaleString("en-IN")} taka ready for the courier.</p>
      </div>
      <div className="mt-12"><OrderSummaryCard order={order} /></div>
      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline"><Link href={`/track?order=${order.orderNumber}`}>Track this order</Link></Button>
        <Button asChild><Link href="/shop">Continue shopping</Link></Button>
      </div>
    </div>
  );
}
