import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validators";
import { publicQuote, quoteCart } from "@/lib/checkout";
import { badRequest, readJson, zodMessage } from "@/lib/api";

export async function POST(req: Request) {
  const parsed = quoteSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(zodMessage(parsed.error));
  const q = await quoteCart(parsed.data.items, parsed.data.zone, parsed.data.couponCode);
  return NextResponse.json(publicQuote(q));
}
