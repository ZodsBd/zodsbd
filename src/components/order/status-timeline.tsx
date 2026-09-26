import type { OrderStatus } from "@prisma/client";
import { Check, X } from "lucide-react";
import { ORDER_FLOW, STATUS_LABEL } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

export function StatusTimeline({ status, events }: { status: OrderStatus; events: { status: OrderStatus; createdAt: Date | string; note: string | null }[] }) {
  const cancelled = status === "CANCELLED";
  const reachedIdx = cancelled
    ? Math.max(...events.filter((e) => e.status !== "CANCELLED").map((e) => ORDER_FLOW.indexOf(e.status)), 0)
    : ORDER_FLOW.indexOf(status);
  const at = (s: OrderStatus) => events.filter((e) => e.status === s).at(-1)?.createdAt;
  const steps: OrderStatus[] = cancelled ? [...ORDER_FLOW.slice(0, reachedIdx + 1), "CANCELLED"] : ORDER_FLOW;
  return (
    <ol className="relative space-y-6 border-l border-border pl-8">
      {steps.map((s, i) => {
        const done = s === "CANCELLED" || i <= reachedIdx;
        const ts = at(s);
        return (
          <li key={s} className="relative">
            <span className={cn("absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full border",
              s === "CANCELLED" ? "border-rose-700 bg-rose-700 text-white" : done ? "border-gold bg-gold text-obsidian" : "border-border bg-white")}>
              {s === "CANCELLED" ? <X className="h-3 w-3" /> : done ? <Check className="h-3 w-3" /> : null}
            </span>
            <p className={cn("text-sm font-medium uppercase tracking-[0.14em]", !done && "text-warm")}>{STATUS_LABEL[s]}</p>
            {ts && <p className="text-xs text-warm-dark">{formatDate(ts, true)}</p>}
          </li>
        );
      })}
    </ol>
  );
}
