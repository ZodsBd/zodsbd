"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Field, Label } from "@/components/ui/label";
import { Card } from "./ui";
import { ImageUploader } from "./image-uploader";
import { TagInput } from "./tag-input";
import { saveProduct, deleteProduct } from "@/actions/products";
import type { ProductInput } from "@/lib/validators";

type Variant = ProductInput["variants"][number] & { key: string };
type Initial = Omit<ProductInput, "variants" | "images" | "specs" | "tags"> & { variants: ProductInput["variants"]; images: { url: string; alt?: string }[]; specs: { label: string; value: string }[]; tags: string[] };

const PRESETS: Record<string, { colorLabel: string | null; sizeLabel: string | null; sizeGuide: "belt" | "backpack" | null; colors: string[]; sizes: string[] }> = {
  backpacks: { colorLabel: "Colour", sizeLabel: "Capacity", sizeGuide: "backpack", colors: ["Black", "Tan", "Coffee", "Olive"], sizes: ["15L", "20L", "25L"] },
  belts: { colorLabel: "Colour", sizeLabel: "Waist", sizeGuide: "belt", colors: ["Black", "Brown", "Tan"], sizes: ["32", "34", "36", "38", "40", "42"] },
  "cigarette-cases": { colorLabel: "Finish", sizeLabel: "Capacity", sizeGuide: null, colors: ["Matte Black", "Brushed Steel", "Gold", "Leather Wrap"], sizes: ["10-stick", "20-stick"] },
  perfumes: { colorLabel: null, sizeLabel: "Volume", sizeGuide: null, colors: [], sizes: ["30ml", "50ml", "100ml"] },
  "clutch-bags": { colorLabel: "Colour", sizeLabel: null, sizeGuide: null, colors: ["Black", "Ivory", "Gold", "Maroon"], sizes: [] },
};

let seq = 0;
const k = () => `v${Date.now()}${seq++}`;

export function ProductForm({ id, initial, categories }: { id: string | null; initial: Initial; categories: { id: string; name: string; slug: string }[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [f, setF] = useState(initial);
  const [variants, setVariants] = useState<Variant[]>(initial.variants.map((v) => ({ ...v, key: v.id ?? k() })));
  const [genColors, setGenColors] = useState<string[]>([]);
  const [genSizes, setGenSizes] = useState<string[]>([]);
  const [genPrice, setGenPrice] = useState("");
  const set = <K extends keyof Initial>(key: K, v: Initial[K]) => setF((s) => ({ ...s, [key]: v }));
  const setV = (key: string, patch: Partial<Variant>) => setVariants((vs) => vs.map((v) => (v.key === key ? { ...v, ...patch } : v)));

  const applyPreset = (categoryId: string) => {
    const slug = categories.find((c) => c.id === categoryId)?.slug ?? "";
    const p = PRESETS[slug];
    set("categoryId", categoryId);
    if (!p) return;
    setF((s) => ({ ...s, categoryId, colorLabel: p.colorLabel, sizeLabel: p.sizeLabel, sizeGuide: p.sizeGuide }));
    setGenColors(p.colors); setGenSizes(p.sizes);
  };

  const generate = () => {
    const colors = genColors.length ? genColors : [null];
    const sizes = genSizes.length ? genSizes : [null];
    const prefix = (f.slug || f.name).toUpperCase().replace(/[^A-Z0-9]+/g, "").slice(0, 8) || "ZOD";
    const existing = new Set(variants.map((v) => `${v.color ?? ""}|${v.size ?? ""}`));
    const add: Variant[] = [];
    colors.forEach((c) => sizes.forEach((s) => {
      if (existing.has(`${c ?? ""}|${s ?? ""}`)) return;
      const sku = [prefix, c?.replace(/[^A-Z0-9]/gi, "").slice(0, 3).toUpperCase(), s?.replace(/[^A-Z0-9]/gi, "").toUpperCase()].filter(Boolean).join("-");
      add.push({ key: k(), sku, color: c, size: s, price: Number(genPrice) || 0, compareAtPrice: null, stock: 0, imageUrl: null });
    }));
    setVariants((v) => [...v, ...add]);
    toast.success(`${add.length} variant(s) added`);
  };

  const submit = () => start(async () => {
    const res = await saveProduct(id, { ...f, variants: variants.map(({ key: _k, ...v }) => { void _k; return v; }) });
    if (!res.ok) return void toast.error(res.error);
    toast.success("Product saved");
    if (!id) router.replace(`/admin/products/${res.id}`); else router.refresh();
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <Card title="Details">
          <div className="grid gap-4">
            <Field label="Name *" htmlFor="p-name"><Input id="p-name" value={f.name} onChange={(e) => set("name", e.target.value)} required /></Field>
            <Field label="URL slug (auto if empty)" htmlFor="p-slug"><Input id="p-slug" value={f.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="e.g. heritage-leather-belt" /></Field>
            <Field label="Short description" htmlFor="p-short"><Input id="p-short" value={f.shortDescription ?? ""} onChange={(e) => set("shortDescription", e.target.value)} maxLength={240} /></Field>
            <Field label="Full description *" htmlFor="p-desc"><Textarea id="p-desc" rows={6} value={f.description} onChange={(e) => set("description", e.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Images">
          <ImageUploader value={f.images.map((i) => i.url)} onChange={(urls) => set("images", urls.map((url) => ({ url, alt: f.images.find((i) => i.url === url)?.alt ?? f.name })))} />
        </Card>
        <Card title="Variants">
          <div className="mb-4 grid gap-3 rounded bg-ivory p-4 md:grid-cols-[1fr_1fr_120px_auto]">
            <div><Label>{f.colorLabel || "Colour"} options</Label><TagInput value={genColors} onChange={setGenColors} placeholder="Black, Tan…" /></div>
            <div><Label>{f.sizeLabel || "Size"} options</Label><TagInput value={genSizes} onChange={setGenSizes} placeholder="32, 34…" /></div>
            <div><Label>Base price ৳</Label><Input inputMode="numeric" value={genPrice} onChange={(e) => setGenPrice(e.target.value.replace(/\D/g, ""))} /></div>
            <Button type="button" variant="outline" className="self-end" onClick={generate}><Wand2 />Generate</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="text-left text-[10px] uppercase tracking-wider text-warm-dark">
                <tr><th className="pb-2">SKU</th><th className="pb-2">{f.colorLabel || "Colour"}</th><th className="pb-2">{f.sizeLabel || "Size"}</th><th className="pb-2">Price ৳</th><th className="pb-2">Compare-at ৳</th><th className="pb-2">Stock</th><th className="pb-2">Image URL</th><th /></tr>
              </thead>
              <tbody>
                {variants.map((v) => (
                  <tr key={v.key} className="align-top">
                    <td className="pr-2 pb-2"><Input className="h-9 uppercase" value={v.sku} onChange={(e) => setV(v.key, { sku: e.target.value })} aria-label="SKU" /></td>
                    <td className="pr-2 pb-2"><Input className="h-9" value={v.color ?? ""} onChange={(e) => setV(v.key, { color: e.target.value || null })} aria-label="Colour" /></td>
                    <td className="pr-2 pb-2"><Input className="h-9 w-24" value={v.size ?? ""} onChange={(e) => setV(v.key, { size: e.target.value || null })} aria-label="Size" /></td>
                    <td className="pr-2 pb-2"><Input className="h-9 w-24" inputMode="numeric" value={String(v.price)} onChange={(e) => setV(v.key, { price: Number(e.target.value.replace(/\D/g, "")) || 0 })} aria-label="Price" /></td>
                    <td className="pr-2 pb-2"><Input className="h-9 w-24" inputMode="numeric" value={v.compareAtPrice == null ? "" : String(v.compareAtPrice)} onChange={(e) => setV(v.key, { compareAtPrice: e.target.value ? Number(e.target.value.replace(/\D/g, "")) : null })} aria-label="Compare-at price" /></td>
                    <td className="pr-2 pb-2"><Input className={`h-9 w-20 ${Number(v.stock) < 5 ? "border-amber-400" : ""}`} inputMode="numeric" value={String(v.stock)} onChange={(e) => setV(v.key, { stock: Number(e.target.value.replace(/\D/g, "")) || 0 })} aria-label="Stock" /></td>
                    <td className="pr-2 pb-2">
                      <Select className="h-9" value={v.imageUrl ?? ""} onChange={(e) => setV(v.key, { imageUrl: e.target.value || null })} aria-label="Variant image">
                        <option value="">— none —</option>
                        {f.images.map((im, i) => <option key={im.url} value={im.url}>Image {i + 1}</option>)}
                      </Select>
                    </td>
                    <td className="pb-2"><button type="button" onClick={() => setVariants((vs) => vs.filter((x) => x.key !== v.key))} aria-label="Remove variant" className="p-2 text-warm-dark hover:text-rose-700"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setVariants((vs) => [...vs, { key: k(), sku: "", color: null, size: null, price: 0, compareAtPrice: null, stock: 0, imageUrl: null }])}><Plus />Add variant</Button>
        </Card>
        <Card title="Specifications">
          <div className="space-y-2">
            {f.specs.map((s, i) => (
              <div key={i} className="flex gap-2">
                <Input className="h-9" placeholder="Label" value={s.label} onChange={(e) => set("specs", f.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} aria-label="Spec label" />
                <Input className="h-9" placeholder="Value" value={s.value} onChange={(e) => set("specs", f.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} aria-label="Spec value" />
                <button type="button" onClick={() => set("specs", f.specs.filter((_, j) => j !== i))} aria-label="Remove spec" className="p-2 text-warm-dark hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={() => set("specs", [...f.specs, { label: "", value: "" }])}><Plus />Add spec</Button>
          </div>
        </Card>
      </div>
      <div className="space-y-4">
        <Card title="Publish">
          <div className="space-y-4">
            <Field label="Status" htmlFor="p-status">
              <Select id="p-status" value={f.status} onChange={(e) => set("status", e.target.value as "ACTIVE" | "DRAFT")}><option value="ACTIVE">Active (visible)</option><option value="DRAFT">Draft (hidden)</option></Select>
            </Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-obsidian" checked={f.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-obsidian" checked={f.isBestseller} onChange={(e) => set("isBestseller", e.target.checked)} />Bestseller</label>
            <Button type="submit" className="w-full" disabled={pending}>{pending ? "Saving…" : "Save product"}</Button>
            {id && (
              <Button type="button" variant="destructive" size="sm" className="w-full" disabled={pending} onClick={() => {
                if (!confirm("Delete this product? Past orders keep their details.")) return;
                start(async () => { await deleteProduct(id); toast.success("Deleted"); router.replace("/admin/products"); });
              }}><Trash2 />Delete product</Button>
            )}
          </div>
        </Card>
        <Card title="Organisation">
          <div className="space-y-4">
            <Field label="Category *" htmlFor="p-cat">
              <Select id="p-cat" value={f.categoryId} onChange={(e) => applyPreset(e.target.value)}>
                <option value="" disabled>Select…</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Tags" htmlFor="p-tags"><TagInput id="p-tags" value={f.tags} onChange={(v) => set("tags", v)} /></Field>
          </div>
        </Card>
        <Card title="Option labels">
          <div className="space-y-4">
            <Field label="Colour option label (blank = none)" htmlFor="p-cl"><Input id="p-cl" value={f.colorLabel ?? ""} onChange={(e) => set("colorLabel", e.target.value || null)} placeholder="Colour / Finish" /></Field>
            <Field label="Size option label (blank = none)" htmlFor="p-sl"><Input id="p-sl" value={f.sizeLabel ?? ""} onChange={(e) => set("sizeLabel", e.target.value || null)} placeholder="Waist / Capacity / Volume" /></Field>
            <Field label="Size guide" htmlFor="p-sg">
              <Select id="p-sg" value={f.sizeGuide ?? ""} onChange={(e) => set("sizeGuide", (e.target.value || null) as "belt" | "backpack" | null)}>
                <option value="">None</option><option value="belt">Belt</option><option value="backpack">Backpack</option>
              </Select>
            </Field>
          </div>
        </Card>
      </div>
    </form>
  );
}
