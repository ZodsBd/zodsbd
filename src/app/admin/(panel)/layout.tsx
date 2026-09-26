import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin | Zod's Bd" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const [pendingOrders, pendingReviews, unread] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <AdminSidebar name={session.name} counts={{ pendingOrders, pendingReviews, unread }} />
      <main className="lg:pl-60 print:pl-0">{children}</main>
    </div>
  );
}
