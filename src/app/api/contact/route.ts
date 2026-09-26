import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { badRequest, readJson, zodMessage } from "@/lib/api";

export async function POST(req: Request) {
  const parsed = contactSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(zodMessage(parsed.error));
  await prisma.contactMessage.create({ data: parsed.data });
  return NextResponse.json({ ok: true }, { status: 201 });
}
