import { NextResponse } from "next/server";
import { reviewSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { badRequest, readJson, zodMessage } from "@/lib/api";

export async function POST(req: Request) {
  const parsed = reviewSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(zodMessage(parsed.error));
  const exists = await prisma.product.findFirst({ where: { id: parsed.data.productId, status: "ACTIVE" }, select: { id: true } });
  if (!exists) return badRequest("Product not found");
  await prisma.review.create({ data: { ...parsed.data, status: "PENDING" } });
  return NextResponse.json({ ok: true }, { status: 201 });
}
