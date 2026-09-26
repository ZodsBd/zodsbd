"use client";
import type { DeliveryZone } from "@prisma/client";
import { ZONES } from "@/lib/shipping";
import { formatBDT } from "@/lib/money";
import { useStore } from "@/components/store-provider";
import { cn } from "@/lib/utils";

export function ZoneRadio({ value, onChange, name = "zone" }: { value: DeliveryZone; onChange: (z: DeliveryZone) => void; name?: string }) {
  const { rates } = useStore();
  return (
    <fieldset>
      <legend className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-warm-dark">Delivery zone</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {ZONES.map((z) => (
          <label key={z.value} className={cn("flex cursor-pointer flex-col border px-4 py-3 text-sm transition-colors", value === z.value ? "border-obsidian bg-ivory" : "border-border hover:border-warm")}>
            <span className="flex items-center gap-2">
              <input type="radio" name={name} value={z.value} checked={value === z.value} onChange={() => onChange(z.value)} className="accent-obsidian" />
              <span className="font-medium">{z.label}</span>
            </span>
            <span className="mt-1 pl-5 text-xs text-warm-dark">{formatBDT(rates[z.value])} · {z.hint}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
