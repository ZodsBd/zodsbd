import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { orderRequestSchema } from "@/lib/validators";
import { quoteCart } from "@/lib/checkout";
import { nextOrderNumber } from "@/lib/order-number";
import { refreshProductAggregates } from "@/lib/product-aggregates";
import { prisma } from "@/lib/prisma";
import { badRequest, readJson, zodMessage } from "@/lib/api";
import { variantLabel } from "@/lib/utils";

class CheckoutError extends Error {}

export async function POST(req: Request) {
  const parsed = orderRequestSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(zodMessage(parsed.error));
  const d = parsed.data;

  try {
    const order = await prisma.$transaction(
      async (tx) => {
        const q = await quoteCart(d.items, d.zone, d.couponCode, tx);
        if (q.issues.length) throw new CheckoutError(q.issues[0]);
        if (d.couponCode && q.couponError) throw new CheckoutError(q.couponError);

        // Atomic conditional decrement: fails if another order took the stock first.
        for (const l of q.lines) {
          const res = await tx.productVariant.updateMany({ where: { id: l.variantId, stock: { gte: l.quantity } }, data: { stock: { decrement: l.quantity } } });
          if (res.count !== 1) throw new CheckoutError(`${l.variant!.product.name} just sold out. Please update your bag.`);
          await tx.product.update({ where: { id: l.variant!.productId }, data: { soldCount: { increment: l.quantity } } });
        }
        if (q.coupon) {
          const upd = await tx.coupon.updateMany({
            where: { id: q.coupon.id, isActive: true, ...(q.coupon.usageLimit !== null ? { usedCount: { lt: q.coupon.usageLimit } } : {}) },
            data: { usedCount: { increment: 1 } },
          });
          if (upd.count !== 1) throw new CheckoutError("This coupon has reached its usage limit");
        }

        const customer = await tx.customer.upsert({
          where: { phone: d.phone },
          create: { phone: d.phone, name: d.fullName, email: d.email, district: d.district },
          update: { name: d.fullName, district: d.district, ...(d.email ? { email: d.email } : {}) },
        });
        const orderNumber = await nextOrderNumber(tx);
        const created = await tx.order.create({
          data: {
            orderNumber, customerId: customer.id, customerName: d.fullName, phone: d.phone, email: d.email,
            address: d.address, district: d.district, thana: d.thana, zone: d.zone, notes: d.notes || null,
            subtotal: q.subtotal, discount: q.discount, shippingFee: q.shippingFee, total: q.total,
            couponCode: q.couponCode, couponId: q.coupon?.id ?? null,
            items: {
              create: q.lines.map((l) => ({
                productId: l.variant!.productId, variantId: l.variantId, productName: l.variant!.product.name,
                variantLabel: variantLabel(l.variant!) || null, sku: l.variant!.sku,
                image: l.variant!.imageUrl ?? l.variant!.product.images[0]?.url ?? null,
                unitPrice: l.price, quantity: l.quantity, lineTotal: l.lineTotal,
              })),
            },
            events: { create: { status: "PENDING", note: "Order placed · Cash on Delivery" } },
          },
          select: { orderNumber: true },
        });
        const productIds = [...new Set(q.lines.map((l) => l.variant!.productId))];
        for (const pid of productIds) await refreshProductAggregates(tx, pid);
        return { ...created, productIds };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, timeout: 15000, maxWait: 10000 }
    );
    revalidatePath("/", "layout");
    return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
  } catch (e) {
    if (e instanceof CheckoutError) return NextResponse.json({ error: e.message }, { status: 409 });
    console.error("order create failed", e);
    return NextResponse.json({ error: "We couldn't place your order. Please try again." }, { status: 500 });
  }
}
