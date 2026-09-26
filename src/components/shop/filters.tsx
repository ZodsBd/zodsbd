"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = { categories: { name: string; slug: string }[]; colors: string[]; sizes: string[]; showCategory: boolean };

function useQueryUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  return (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v === null || v === "" ? next.delete(k) : next.set(k, v)));
    next.delete("page");
    router.push(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false });
  };
}

function FilterPanel({ categories, colors, sizes, showCategory }: Props) {
  const sp = useSearchParams();
  const update = useQueryUpdater();
  const list = (k: string) => (sp.get(k) ? sp.get(k)!.split(",") : []);
  const toggleIn = (k: string, v: string) => {
    const cur = list(k);
    const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
    update({ [k]: next.join(",") || null });
  };
  const [min, setMin] = useState(sp.get("min") ?? "");
  const [max, setMax] = useState(sp.get("max") ?? "");
  useEffect(() => { setMin(sp.get("min") ?? ""); setMax(sp.get("max") ?? ""); }, [sp]);

  return (
    <div className="space-y-8">
      {showCategory && (
        <FilterGroup title="Category">
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => update({ category: null })} className={cn("hover:text-gold-dark", !sp.get("category") && "font-medium text-gold-dark")}>All</button></li>
            {categories.map((c) => (
              <li key={c.slug}><button onClick={() => update({ category: c.slug })} className={cn("hover:text-gold-dark", sp.get("category") === c.slug && "font-medium text-gold-dark")}>{c.name}</button></li>
            ))}
          </ul>
        </FilterGroup>
      )}
      <FilterGroup title="Price (৳)">
        <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); update({ min: min || null, max: max || null }); }}>
          <label className="sr-only" htmlFor="pmin">Minimum price</label>
          <Input id="pmin" inputMode="numeric" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))} className="h-9" />
          <span className="text-warm">–</span>
          <label className="sr-only" htmlFor="pmax">Maximum price</label>
          <Input id="pmax" inputMode="numeric" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))} className="h-9" />
          <Button type="submit" size="sm" variant="outline" className="h-9 px-3">Go</Button>
        </form>
      </FilterGroup>
      {colors.length > 0 && (
        <FilterGroup title="Colour / Finish">
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => <Chip key={c} active={list("color").includes(c)} onClick={() => toggleIn("color", c)}>{c}</Chip>)}
          </div>
        </FilterGroup>
      )}
      {sizes.length > 0 && (
        <FilterGroup title="Size">
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => <Chip key={s} active={list("size").includes(s)} onClick={() => toggleIn("size", s)}>{s}</Chip>)}
          </div>
        </FilterGroup>
      )}
      <FilterGroup title="Availability">
        <Check label="In stock only" checked={sp.get("inStock") === "1"} onChange={(v) => update({ inStock: v ? "1" : null })} />
        <Check label="On sale only" checked={sp.get("onSale") === "1"} onChange={(v) => update({ onSale: v ? "1" : null })} />
      </FilterGroup>
      <Button variant="ghost" size="sm" className="px-0" onClick={() => update({ category: null, min: null, max: null, color: null, size: null, inStock: null, onSale: null, q: null })}>
        Clear all filters
      </Button>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em]">{title}</legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={cn("border px-3 py-1.5 text-xs transition-colors", active ? "border-obsidian bg-obsidian text-white" : "border-border hover:border-obsidian")}>{children}</button>;
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-obsidian" />{label}
    </label>
  );
}

export function ShopToolbar(props: Props & { total: number }) {
  const sp = useSearchParams();
  const update = useQueryUpdater();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [sp]);
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] lg:hidden"><SlidersHorizontal className="h-4 w-4" />Filters</button>
      <p className="hidden text-sm text-warm-dark lg:block">{props.total} {props.total === 1 ? "piece" : "pieces"}</p>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="hidden text-[11px] uppercase tracking-[0.2em] text-warm-dark sm:block">Sort</label>
        <Select id="sort" value={sp.get("sort") ?? "newest"} onChange={(e) => update({ sort: e.target.value === "newest" ? null : e.target.value })} className="h-10 w-48">
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="popular">Most Popular</option>
        </Select>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Filters" side="left"><div className="overflow-y-auto p-6"><FilterPanel {...props} /></div></DialogContent>
      </Dialog>
    </div>
  );
}

export function ShopSidebar(props: Props) {
  return <aside aria-label="Filters" className="hidden lg:block"><FilterPanel {...props} /></aside>;
}
