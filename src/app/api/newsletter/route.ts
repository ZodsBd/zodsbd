import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { badRequest, readJson, zodMessage } from "@/lib/api";

export async function POST(req: Request) {
  const parsed = newsletterSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(zodMessage(parsed.error));
  const email = parsed.data.email.toLowerCase();
  await prisma.newsletterSubscriber.upsert({ where: { email }, create: { email }, update: {} });
  return NextResponse.json({ ok: true });
}
