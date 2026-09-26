"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { refreshProductAggregates } from "@/lib/product-aggregates";

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

/** Changes status; cancelling restores stock once, un-cancelling re-deducts it. */
export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  await requireAdmin();
  if (!STATUSES.includes(status)) return { error: "Invalid status" };
  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { items: true } });
      if (order.status === status) return;
      const touched = new Set<string>();
      if (status === "CANCELLED" && !order.stockRestored) {
        for (const it of order.items) {
          if (it.variantId) await tx.productVariant.updateMany({ where: { id: it.variantId }, data: { stock: { increment: it.quantity } } });
          if (it.productId) { await tx.product.updateMany({ where: { id: it.productId }, data: { soldCount: { decrement: it.quantity } } }); touched.add(it.productId); }
        }
        if (order.couponId) await tx.coupon.updateMany({ where: { id: order.couponId, usedCount: { gt: 0 } }, data: { usedCount: { decrement: 1 } } });
        await tx.order.update({ where: { id: orderId }, data: { stockRestored: true } });
      }
      if (order.status === "CANCELLED" && status !== "CANCELLED" && order.stockRestored) {
        for (const it of order.items) {
          if (!it.variantId) continue;
          const r = await tx.productVariant.updateMany({ where: { id: it.variantId, stock: { gte: it.quantity } }, data: { stock: { decrement: it.quantity } } });
          if (r.count !== 1) throw new Error(`Not enough stock to re-open (${it.productName} ${it.variantLabel ?? ""})`);
          if (it.productId) { await tx.product.updateMany({ where: { id: it.productId }, data: { soldCount: { increment: it.quantity } } }); touched.add(it.productId); }
        }
        if (order.couponId) await tx.coupon.updateMany({ where: { id: order.couponId }, data: { usedCount: { increment: 1 } } });
        await tx.order.update({ where: { id: orderId }, data: { stockRestored: false } });
      }
      await tx.order.update({ where: { id: orderId }, data: { status, events: { create: { status, note: note || null } } } });
      for (const pid of touched) await refreshProductAggregates(tx, pid);
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Update failed" };
  }
  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function addOrderNote(orderId: string, body: string) {
  const s = await requireAdmin();
  const text = body.trim();
  if (!text) return { error: "Note is empty" };
  await prisma.orderNote.create({ data: { orderId, body: text.slice(0, 2000), author: s.name } });
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}

export async function deleteOrderNote(noteId: string, orderId: string) {
  await requireAdmin();
  await prisma.orderNote.delete({ where: { id: noteId } });
  revalidatePath(`/admin/orders/${orderId}`);
}

/** Deleting an un-cancelled order returns its stock first. */
export async function deleteOrder(orderId: string) {
  await requireAdmin();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) redirect("/admin/orders");
  if (order.status !== "CANCELLED" || !order.stockRestored) {
    const r = await updateOrderStatus(orderId, "CANCELLED", "Cancelled before deletion");
    if (r.error) return r;
  }
  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath("/admin", "layout");
  redirect("/admin/orders");
}
