import { ogCard, OG_SIZE } from "@/lib/og";
import { prisma } from "@/lib/prisma";
import { formatBDT } from "@/lib/money";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Zod's Bd product";

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const p = await prisma.product.findUnique({
    where: { slug: (await params).slug },
    select: { name: true, minPrice: true, category: { select: { name: true } }, images: { take: 1, orderBy: { sortOrder: "asc" }, select: { url: true } } },
  });
  if (!p) return ogCard({ eyebrow: "Luxury Accessories", title: "Zod's Bd" });
  return ogCard({ eyebrow: p.category.name, title: p.name, subtitle: `From ${formatBDT(p.minPrice)} · Cash on Delivery`, image: p.images[0]?.url });
}
