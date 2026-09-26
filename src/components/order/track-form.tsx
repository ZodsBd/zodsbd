"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OrderStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { trackSchema } from "@/lib/validators";
import { STATUS_LABEL, STATUS_STYLE } from "@/lib/constants";
import { formatBDT } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { StatusTimeline } from "./status-timeline";
import { OrderSummaryCard } from "./order-summary-card";
import type { z } from "zod";

type Values = z.input<typeof trackSchema>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TrackResult = { order: any; history: { orderNumber: string; createdAt: string; status: OrderStatus; total: number; _count: { items: number } }[] };

export function TrackForm() {
  const sp = useSearchParams();
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, getValues, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(trackSchema),
    defaultValues: { orderNumber: sp.get("order") ?? "", phone: "" },
  });
  const lookup = async (v: Values) => {
    setError(null);
    const res = await fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
    const data = await res.json();
    if (!res.ok) { setResult(null); setError(data.error || "Not found"); return; }
    setResult(data);
  };
  return (
    <div className="container max-w-3xl py-12 md:py-16">
      <form onSubmit={handleSubmit(lookup)} noValidate className="grid gap-5 bg-ivory p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end md:p-8">
        <Field label="Order number" htmlFor="t-order" error={errors.orderNumber?.message}>
          <Input id="t-order" placeholder="ZB-260925-0001" className="uppercase" {...register("orderNumber")} aria-invalid={!!errors.orderNumber} />
        </Field>
        <Field label="Phone number" htmlFor="t-phone" error={errors.phone?.message}>
          <Input id="t-phone" type="tel" inputMode="numeric" placeholder="01XXXXXXXXX" {...register("phone")} aria-invalid={!!errors.phone} />
        </Field>
        <Button type="submit" disabled={isSubmitting} className="h-11">{isSubmitting ? "Searching…" : "Track"}</Button>
      </form>
      {error && <p role="alert" className="mt-6 text-center text-sm text-rose-700">{error}</p>}
      {result && (
        <div className="mt-12 space-y-14">
          <section aria-label="Status" className="grid gap-10 md:grid-cols-[240px_1fr]">
            <div><p className="eyebrow">Status</p><h2 className="mt-2 font-serif text-3xl">{STATUS_LABEL[result.order.status as OrderStatus]}</h2></div>
            <StatusTimeline status={result.order.status} events={result.order.events} />
          </section>
          <OrderSummaryCard order={result.order} />
          {result.history.length > 1 && (
            <section aria-labelledby="hist-h">
              <h2 id="hist-h" className="font-serif text-3xl">All orders for this phone</h2>
              <ul className="mt-6 divide-y divide-border border-y border-border">
                {result.history.map((h) => (
                  <li key={h.orderNumber} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
                    <div>
                      <p className="font-medium">{h.orderNumber}</p>
                      <p className="text-xs text-warm-dark">{formatDate(h.createdAt)} · {h._count.items} item(s) · {formatBDT(h.total)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={STATUS_STYLE[h.status]}>{STATUS_LABEL[h.status]}</Badge>
                      {h.orderNumber !== result.order.orderNumber && (
                        <button className="text-xs underline" onClick={() => { setValue("orderNumber", h.orderNumber); void lookup({ orderNumber: h.orderNumber, phone: getValues("phone") }); }}>View</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <p className="text-center text-sm text-warm-dark">Need help? <Link href="/contact" className="underline">Contact us</Link></p>
        </div>
      )}
    </div>
  );
}
