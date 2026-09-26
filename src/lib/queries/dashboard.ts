import type { OrderStatus } from "@prisma/client";
import { prisma } from "../prisma";
import { dhakaDateKey, dhakaStartOfDay } from "../dates";

const REVENUE_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];

export async function getDashboard() {
  const today = dhakaStartOfDay();
  const since30 = dhakaStartOfDay(new Date(), -29);
  const [todayAgg, pendingCod, byStatus, recent, topItems, lowStock] = await Promise.all([
    prisma.order.aggregate({ where: { createdAt: { gte: today }, status: { in: REVENUE_STATUSES } }, _sum: { total: true }, _count: true }),
    prisma.order.aggregate({ where: { status: { in: ["PENDING", "CONFIRMED", "PACKED", "SHIPPED"] } }, _sum: { total: true }, _count: true }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.order.findMany({ where: { createdAt: { gte: since30 }, status: { in: REVENUE_STATUSES } }, select: { createdAt: true, total: true } }),
    prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      where: { order: { status: { not: "CANCELLED" } } },
      _sum: { quantity: true, lineTotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.productVariant.findMany({
      where: { stock: { lt: 5 }, product: { status: "ACTIVE" } },
      orderBy: { stock: "asc" },
      take: 20,
      select: { id: true, sku: true, color: true, size: true, stock: true, product: { select: { id: true, name: true } } },
    }),
  ]);

  const buckets = new Map<string, { revenue: number; orders: number }>();
  for (let i = 29; i >= 0; i--) buckets.set(dhakaDateKey(dhakaStartOfDay(new Date(), -i)), { revenue: 0, orders: 0 });
  recent.forEach((o) => {
    const b = buckets.get(dhakaDateKey(o.createdAt));
    if (b) { b.revenue += o.total; b.orders += 1; }
  });
  const series = [...buckets.entries()].map(([date, v]) => ({ date, label: date.slice(5), ...v }));
  const sum = (arr: typeof series) => arr.reduce((s, x) => s + x.revenue, 0);

  const statusCounts = Object.fromEntries(byStatus.map((s) => [s.status, s._count])) as Partial<Record<OrderStatus, number>>;

  return {
    todayOrders: todayAgg._count,
    todayRevenue: todayAgg._sum.total ?? 0,
    pendingCodValue: pendingCod._sum.total ?? 0,
    pendingCodCount: pendingCod._count,
    statusCounts,
    series30: series,
    series7: series.slice(-7),
    revenue7: sum(series.slice(-7)),
    revenue30: sum(series),
    topProducts: topItems.map((t) => ({ productId: t.productId, name: t.productName, qty: t._sum.quantity ?? 0, revenue: t._sum.lineTotal ?? 0 })),
    lowStock,
  };
}
