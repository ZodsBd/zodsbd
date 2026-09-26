import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ value, count, className, size = 14 }: { value: number; count?: number; className?: string; size?: number }) {
  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Rated ${value.toFixed(1)} out of 5${count !== undefined ? `, ${count} reviews` : ""}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} width={size} height={size} className={i <= Math.round(value) ? "fill-gold text-gold" : "text-border"} aria-hidden />
      ))}
      {count !== undefined && <span className="ml-1 text-xs text-warm-dark">({count})</span>}
    </div>
  );
}
