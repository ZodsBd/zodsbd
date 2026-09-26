import type { Prisma } from "@prisma/client";

/** Asia/Dhaka date as YYMMDD */
export function dhakaDayKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka", year: "2-digit", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}${get("month")}${get("day")}`;
}

/** Atomic per-day counter inside the order transaction → ZB-YYMMDD-XXXX */
export async function nextOrderNumber(tx: Prisma.TransactionClient, date = new Date()): Promise<string> {
  const day = dhakaDayKey(date);
  const seq = await tx.orderSequence.upsert({
    where: { day },
    create: { day, last: 1 },
    update: { last: { increment: 1 } },
  });
  return `ZB-${day}-${String(seq.last).padStart(4, "0")}`;
}
