import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function badRequest(error: string, details?: unknown) {
  return NextResponse.json({ error, details }, { status: 400 });
}

export function zodMessage(err: ZodError): string {
  return err.issues[0]?.message ?? "Invalid input";
}

export async function readJson(req: Request): Promise<unknown> {
  try { return await req.json(); } catch { return null; }
}
