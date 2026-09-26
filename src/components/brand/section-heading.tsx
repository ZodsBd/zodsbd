import { cn } from "@/lib/utils";

export function GoldDivider({ className }: { className?: string }) {
  return <div aria-hidden className={cn("mx-auto h-px w-16 bg-gold", className)} />;
}

export function SectionHeading({ eyebrow, title, className, align = "center" }: { eyebrow?: string; title: string; className?: string; align?: "center" | "left" }) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow && <p className="mb-3 text-[11px] font-medium uppercase tracking-luxe text-gold-dark">{eyebrow}</p>}
      <h2 className="font-serif text-3xl font-medium text-obsidian md:text-5xl">{title}</h2>
      <GoldDivider className={cn("mt-5", align === "left" && "mx-0")} />
    </div>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <header className="border-b border-border bg-ivory py-14 text-center md:py-20">
      <div className="container">
        {eyebrow && <p className="mb-3 text-[11px] uppercase tracking-luxe text-gold-dark">{eyebrow}</p>}
        <h1 className="font-serif text-4xl font-medium md:text-6xl">{title}</h1>
        <GoldDivider className="mt-6" />
        {intro && <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-warm-dark md:text-base">{intro}</p>}
      </div>
    </header>
  );
}
