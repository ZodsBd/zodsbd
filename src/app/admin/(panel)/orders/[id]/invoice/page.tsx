import { notFound } from "next/navigation";
import { PrintDoc } from "@/components/admin/print-doc";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "invoice" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, settings] = await Promise.all([prisma.order.findUnique({ where: { id }, include: { items: true } }), getSettings()]);
  if (!order) notFound();
  return <PrintDoc kind="invoice" order={order} settings={settings} />;
}
