import Link from "next/link";
import { Suspense } from "react";
import { AdminPage, PageLinks, Table, Td } from "@/components/admin/ui";
import { OrderFilters } from "@/components/admin/order-filters";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { orderWhere, type OrderFilters as F } from "@/lib/queries/admin-orders";
import { formatBDT } from "@/lib/money";
import { zoneLabel } from "@/lib/shipping";
import { STATUS_LABEL, STATUS_STYLE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Orders" };
const PER = 25;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<F> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const where = orderWhere(sp);
  const [orders, total, sum] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER, take: PER, include: { _count: { select: { items: true } } } }),
    prisma.order.count({ where }),
    prisma.order.aggregate({ where, _sum: { total: true } }),
  ]);
  const qs = (p: number) => { const n = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]); n.set("page", String(p)); return `/admin/orders?${n}`; };
  return (
    <AdminPage title="Orders" description={`${total} orders · ${formatBDT(sum._sum.total ?? 0)}`}>
      <Suspense><OrderFilters /></Suspense>
      <Table head={["Order", "Date", "Customer", "District / Zone", "Items", "Total", "Status"]} empty={!orders.length}>
        {orders.map((o) => (
          <tr key={o.id} className="hover:bg-ivory/40">
            <Td><Link href={`/admin/orders/${o.id}`} className="font-medium hover:underline">{o.orderNumber}</Link></Td>
            <Td className="whitespace-nowrap text-xs text-warm-dark">{formatDate(o.createdAt, true)}</Td>
            <Td><p>{o.customerName}</p><p className="text-xs text-warm-dark">{o.phone}</p></Td>
            <Td><p>{o.district}</p><p className="text-xs text-warm-dark">{zoneLabel(o.zone)}</p></Td>
            <Td>{o._count.items}</Td>
            <Td className="font-medium">{formatBDT(o.total)}</Td>
            <Td><Badge className={STATUS_STYLE[o.status]}>{STATUS_LABEL[o.status]}</Badge></Td>
          </tr>
        ))}
      </Table>
      <PageLinks page={page} pages={Math.ceil(total / PER)} href={qs} />
    </AdminPage>
  );
}
