import { AdminPage } from "@/components/admin/ui";
import { CouponManager } from "@/components/admin/coupon-manager";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Coupons" };

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return <AdminPage title="Coupons"><CouponManager coupons={coupons} /></AdminPage>;
}
