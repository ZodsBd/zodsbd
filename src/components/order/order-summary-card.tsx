import Image from "next/image";
import type { PublicOrder } from "@/lib/queries/orders";
import { SummaryRows } from "@/components/cart/order-summary";
import { formatBDT } from "@/lib/money";
import { zoneLabel } from "@/lib/shipping";
import { formatDate } from "@/lib/utils";
import { STATUS_LABEL, STATUS_STYLE } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

type OrderLike = Omit<PublicOrder, "email" | "customerId" | "couponId" | "stockRestored" | "createdAt"> & { createdAt: Date | string };

export function OrderSummaryCard({ order }: { order: OrderLike }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-warm-dark">Order</p>
          <p className="font-serif text-2xl">{order.orderNumber}</p>
          <p className="text-xs text-warm-dark">Placed {formatDate(order.createdAt, true)}</p>
        </div>
        <Badge className={STATUS_STYLE[order.status]}>{STATUS_LABEL[order.status]}</Badge>
      </div>
      <ul className="divide-y divide-border border-y border-border">
        {order.items.map((it) => (
          <li key={it.id} className="flex gap-4 py-4">
            <div className="relative h-20 w-16 shrink-0 bg-ivory">{it.image && <Image src={it.image} alt="" fill sizes="64px" className="object-cover" />}</div>
            <div className="flex-1 text-sm">
              <p className="font-medium">{it.productName}</p>
              {it.variantLabel && <p className="text-xs text-warm-dark">{it.variantLabel}</p>}
              <p className="text-xs text-warm-dark">{it.quantity} × {formatBDT(it.unitPrice)}</p>
            </div>
            <span className="text-sm">{formatBDT(it.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="text-sm leading-relaxed">
          <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-warm-dark">Deliver to</p>
          <p className="font-medium">{order.customerName}</p>
          <p>{order.phone}</p>
          <p className="whitespace-pre-line">{order.address}</p>
          <p>{order.thana}, {order.district}</p>
          <p className="mt-1 text-xs text-warm-dark">{zoneLabel(order.zone)} · Cash on Delivery</p>
        </div>
        <SummaryRows subtotal={order.subtotal} discount={order.discount} shippingFee={order.shippingFee} total={order.total} couponCode={order.couponCode} />
      </div>
    </div>
  );
}
