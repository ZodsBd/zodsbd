import { AdminPage } from "@/components/admin/ui";
import { BannerManager } from "@/components/admin/banner-manager";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Homepage banners" };

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
  return <AdminPage title="Homepage banners" description="Drag to reorder hero slides."><BannerManager banners={banners} /></AdminPage>;
}
