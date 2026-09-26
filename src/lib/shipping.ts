import type { DeliveryZone } from "@prisma/client";

export const ZONES: { value: DeliveryZone; label: string; hint: string }[] = [
  { value: "INSIDE_DHAKA", label: "Inside Dhaka", hint: "1–2 working days" },
  { value: "DHAKA_SUBURBAN", label: "Dhaka Sub-urban", hint: "2–3 working days" },
  { value: "OUTSIDE_DHAKA", label: "Outside Dhaka", hint: "3–5 working days" },
];

export type ShippingRates = Record<DeliveryZone, number>;

export const DEFAULT_RATES: ShippingRates = { INSIDE_DHAKA: 70, DHAKA_SUBURBAN: 110, OUTSIDE_DHAKA: 150 };

export function zoneLabel(z: DeliveryZone): string {
  return ZONES.find((x) => x.value === z)?.label ?? z;
}

/** Suggests a zone from the district (user can still change it). */
export function suggestZone(district: string): DeliveryZone {
  if (district === "Dhaka") return "INSIDE_DHAKA";
  if (["Gazipur", "Narayanganj", "Munshiganj", "Manikganj", "Narsingdi"].includes(district)) return "DHAKA_SUBURBAN";
  return "OUTSIDE_DHAKA";
}
