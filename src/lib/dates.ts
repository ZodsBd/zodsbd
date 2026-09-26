// Asia/Dhaka is UTC+6 with no DST.
const OFFSET = 6 * 60 * 60 * 1000;

/** Start of the Dhaka calendar day (as a UTC Date) for `d`, shifted by `addDays`. */
export function dhakaStartOfDay(d = new Date(), addDays = 0): Date {
  const local = new Date(d.getTime() + OFFSET);
  local.setUTCHours(0, 0, 0, 0);
  return new Date(local.getTime() - OFFSET + addDays * 86400000);
}

export function dhakaDateKey(d: Date): string {
  return new Date(d.getTime() + OFFSET).toISOString().slice(0, 10);
}

/** Parses YYYY-MM-DD (Dhaka) → UTC Date at Dhaka midnight. */
export function parseDhakaDate(s?: string | null): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  return new Date(new Date(`${s}T00:00:00Z`).getTime() - OFFSET);
}
