import { discountPercent, formatBDT } from "@/lib/money";
import { cn } from "@/lib/utils";

export function Price({ price, compareAt, className, size = "md" }: { price: number; compareAt?: number | null; className?: string; size?: "md" | "lg" }) {
  const off = discountPercent(price, compareAt);
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className={cn("font-medium text-obsidian", size === "lg" ? "text-2xl" : "text-sm")}>{formatBDT(price)}</span>
      {off > 0 && (
        <>
          <s className={cn("text-warm-dark", size === "lg" ? "text-base" : "text-xs")} aria-label={`Was ${formatBDT(compareAt!)}`}>{formatBDT(compareAt!)}</s>
          <span className="bg-gold px-1.5 py-0.5 text-[10px] font-semibold text-obsidian">-{off}%</span>
        </>
      )}
    </div>
  );
}
