import { ogCard, OG_SIZE } from "@/lib/og";
import { prisma } from "@/lib/prisma";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Zod's Bd Journal";

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const p = await prisma.post.findUnique({ where: { slug: (await params).slug }, select: { title: true, coverImage: true } });
  return ogCard({ eyebrow: "The Journal", title: p?.title ?? "Zod's Bd Journal", image: p?.coverImage });
}
