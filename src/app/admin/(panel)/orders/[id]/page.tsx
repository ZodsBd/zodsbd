import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Printer, FileText } from "lucide-react";
import { AdminPage, Card } from "@/components/admin/ui";
import { StatusChanger, NotesPanel, DeleteOrderButton } from "@/components/admin/order-actions";
import { StatusTimeline } from "@/components/order/status-timeline";
import { SummaryRows } from "@/components/cart/order-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatBDT } from "@/lib/money";
import { zoneLabel } from "@/lib/shipping";
import { STATUS_LABEL, STATUS_STYLE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Order" };

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = await prisma.order.findUnique({
    where: { id },
    include: { items: true, events: { orderBy: { createdAt: "asc" } }, internalNotes: { orderBy: { createdAt: "desc" } }, customer: { include: { _count: { select: { orders: true } } } } },
  });
  if (!o) notFound();
  return (
    <AdminPage
      title={o.orderNumber}
      description={`Placed ${formatDate(o.createdAt, true)} · Cash on Delivery`}
      actions={<>
        <Button asChild variant="outline" size="sm"><Link href={`/admin/orders/${o.id}/invoice`} target="_blank"><FileText />Invoice</Link></Button>
        <Button asChild variant="outline" size="sm"><Link href={`/admin/orders/${o.id}/packing-slip`} target="_blank"><Printer />Packing slip</Link></Button>
        <DeleteOrderButton orderId={o.id} />
      </>}
    >
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Card title="Items">
            <ul className="divide-y divide-border">
              {o.items.map((it) => (
                <li key={it.id} className="flex items-center gap-4 py-3 text-sm">
                  <div className="relative h-16 w-14 shrink-0 bg-ivory">{it.image && <Image src={it.image} alt="" fill sizes="56px" className="object-cover" />}</div>
                  <div className="flex-1">
                    {it.productId ? <Link href={`/admin/products/${it.productId}`} className="font-medium hover:underline">{it.productName}</Link> : <p className="font-medium">{it.productName}</p>}
                    <p className="text-xs text-warm-dark">{it.variantLabel} · SKU {it.sku}</p>
                  </div>
                  <span className="text-warm-dark">{it.quantity} × {formatBDT(it.unitPrice)}</span>
                  <span className="w-24 text-right font-medium">{formatBDT(it.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 ml-auto max-w-xs"><SummaryRows subtotal={o.subtotal} discount={o.discount} shippingFee={o.shippingFee} total={o.total} couponCode={o.couponCode} shippingLabel={zoneLabel(o.zone)} /></div>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Customer">
              <div className="space-y-1 text-sm">
                <p className="font-medium">{o.customerName}</p>
                <p><a href={`tel:${o.phone}`} className="hover:underline">{o.phone}</a></p>
                {o.email && <p>{o.email}</p>}
                <p className="text-xs text-warm-dark">{o.customer._count.orders} order(s) from this phone · <Link className="underline" href={`/admin/orders?q=${o.phone}`}>view all</Link></p>
              </div>
            </Card>
            <Card title="Delivery">
              <div className="space-y-1 text-sm">
                <p className="whitespace-pre-line">{o.address}</p>
                <p>{o.thana}, {o.district}</p>
                <p className="text-xs text-warm-dark">{zoneLabel(o.zone)}</p>
                {o.notes && <p className="mt-2 rounded bg-ivory p-2 text-xs"><span className="font-medium">Customer note:</span> {o.notes}</p>}
              </div>
            </Card>
          </div>
        </div>
        <div className="space-y-4">
          <Card title="Status">
            <Badge className={`${STATUS_STYLE[o.status]} mb-4`}>{STATUS_LABEL[o.status]}</Badge>
            <StatusChanger orderId={o.id} status={o.status} />
            <div className="mt-6"><StatusTimeline status={o.status} events={o.events} /></div>
            {o.events.some((e) => e.note) && (
              <ul className="mt-4 space-y-1 text-xs text-warm-dark">
                {o.events.filter((e) => e.note).map((e) => <li key={e.id}>{formatDate(e.createdAt, true)} — {STATUS_LABEL[e.status]}: {e.note}</li>)}
              </ul>
            )}
          </Card>
          <Card title="Internal notes"><NotesPanel orderId={o.id} notes={o.internalNotes} /></Card>
        </div>
      </div>
    </AdminPage>
  );
}
