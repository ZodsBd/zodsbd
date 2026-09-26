import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { toCSV } from "@/lib/csv";
import { orderWhere } from "@/lib/queries/admin-orders";
import { zoneLabel } from "@/lib/shipping";
import { STATUS_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export async function GET(req: Request) {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });
  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const orders = await prisma.order.findMany({ where: orderWhere(sp), orderBy: { createdAt: "desc" }, include: { items: true }, take: 5000 });
  const rows: (string | number | null)[][] = [
    ["Order No", "Date", "Status", "Customer", "Phone", "Email", "Address", "Thana", "District", "Zone", "Items", "Subtotal", "Discount", "Coupon", "Shipping", "Total (COD)", "Notes"],
    ...orders.map((o) => [
      o.orderNumber, formatDate(o.createdAt, true), STATUS_LABEL[o.status], o.customerName, o.phone, o.email, o.address, o.thana, o.district, zoneLabel(o.zone),
      o.items.map((i) => `${i.productName}${i.variantLabel ? ` (${i.variantLabel})` : ""} x${i.quantity}`).join("; "),
      o.subtotal, o.discount, o.couponCode, o.shippingFee, o.total, o.notes,
    ]),
  ];
  return new Response(toCSV(rows), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="zods-orders-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
