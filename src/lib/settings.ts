import { cache } from "react";
import { prisma } from "./prisma";
import type { ShippingRates } from "./shipping";

export const getSettings = cache(async () => {
  return prisma.storeSettings.upsert({ where: { id: "store" }, create: { id: "store" }, update: {} });
});

export function ratesFrom(s: { shippingInsideDhaka: number; shippingSubDhaka: number; shippingOutsideDhaka: number }): ShippingRates {
  return { INSIDE_DHAKA: s.shippingInsideDhaka, DHAKA_SUBURBAN: s.shippingSubDhaka, OUTSIDE_DHAKA: s.shippingOutsideDhaka };
}

export async function getShippingRates(): Promise<ShippingRates> {
  return ratesFrom(await getSettings());
}
