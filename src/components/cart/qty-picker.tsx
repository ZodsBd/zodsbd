"use client";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QtyPicker({ value, onChange, max, className, small }: { value: number; onChange: (n: number) => void; max: number; className?: string; small?: boolean }) {
  const h = small ? "h-8" : "h-12";
  return (
    <div className={cn("inline-flex items-center border border-border", h, className)}>
      <button type="button" aria-label="Decrease quantity" className={cn("flex w-9 items-center justify-center disabled:opacity-30", h)} disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" className={cn("flex w-9 items-center justify-center disabled:opacity-30", h)} disabled={value >= Math.min(max, 20)} onClick={() => onChange(value + 1)}>
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
