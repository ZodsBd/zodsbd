import type { OrderStatus, Prisma } from "@prisma/client";
import { parseDhakaDate } from "../dates";
import { normalizePhone } from "../phone";

export type OrderFilters = { q?: string; status?: string; from?: string; to?: string; page?: string };

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

export function orderWhere(f: OrderFilters): Prisma.OrderWhereInput {
  const q = f.q?.trim();
  const from = parseDhakaDate(f.from);
  const to = parseDhakaDate(f.to);
  return {
    ...(f.status && STATUSES.includes(f.status as OrderStatus) ? { status: f.status as OrderStatus } : {}),
    ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lt: new Date(to.getTime() + 86400000) } : {}) } } : {}),
    ...(q
      ? { OR: [
          { orderNumber: { contains: q.toUpperCase() } },
          { phone: { contains: normalizePhone(q) } },
          { customerName: { contains: q, mode: "insensitive" } },
        ] }
      : {}),
  };
}
