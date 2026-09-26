import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" aria-label="Zod's Bd — home" className={cn("inline-flex items-baseline gap-1.5 font-serif leading-none", className)}>
      <span className={cn("text-2xl font-semibold tracking-[0.32em]", light ? "text-white" : "text-obsidian")}>ZOD&apos;S</span>
      <span className="text-sm font-semibold tracking-[0.32em] text-gold">BD</span>
    </Link>
  );
}
