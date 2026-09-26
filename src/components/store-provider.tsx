"use client";
import { createContext, useContext } from "react";
import type { ShippingRates } from "@/lib/shipping";

type StoreCtx = { rates: ShippingRates };
const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ rates, children }: { rates: ShippingRates; children: React.ReactNode }) {
  return <Ctx.Provider value={{ rates }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}
