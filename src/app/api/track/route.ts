import { NextResponse } from "next/server";
import { trackSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { orderPublicInclude } from "@/lib/queries/orders";
import { badRequest, readJson, zodMessage } from "@/lib/api";

export async function POST(req: Request) {
  const parsed = trackSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(zodMessage(parsed.error));
  const { orderNumber, phone } = parsed.data;
  const order = await prisma.order.findFirst({ where: { orderNumber, phone }, include: orderPublicInclude });
  if (!order) return NextResponse.json({ error: "No order found with that number and phone." }, { status: 404 });
  const history = await prisma.order.findMany({
    where: { phone },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { orderNumber: true, createdAt: true, status: true, total: true, _count: { select: { items: true } } },
  });
  const { email: _e, customerId: _c, couponId: _k, stockRestored: _s, ...safe } = order;
  void [_e, _c, _k, _s];
  return NextResponse.json({ order: safe, history });
}
