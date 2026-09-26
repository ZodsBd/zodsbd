import { prisma } from "../prisma";

export const orderPublicInclude = {
  items: true,
  events: { orderBy: { createdAt: "asc" as const } },
};

export function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({ where: { orderNumber }, include: orderPublicInclude });
}
export type PublicOrder = NonNullable<Awaited<ReturnType<typeof getOrderByNumber>>>;
