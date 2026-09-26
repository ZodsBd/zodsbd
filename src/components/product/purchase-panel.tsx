"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Truck, RefreshCcw, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/brand/price";
import { QtyPicker } from "@/components/cart/qty-picker";
import { WishlistButton } from "./wishlist-button";
import { SizeGuide } from "./size-guide";
import { useCart } from "@/store/cart";
import { cn, variantLabel } from "@/lib/utils";

export type PanelVariant = { id: string; sku: string; color: string | null; size: string | null; price: number; compareAtPrice: number | null; stock: number; imageUrl: string | null };

type Props = {
  product: { id: string; slug: string; name: string; image: string | null; colorLabel: string | null; sizeLabel: string | null; sizeGuide: string | null };
  variants: PanelVariant[];
  onVariantImage?: (url: string | null) => void;
};

export function PurchasePanel({ product, variants, onVariantImage }: Props) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const colors = useMemo(() => [...new Set(variants.map((v) => v.color).filter(Boolean))] as string[], [variants]);
  const sizes = useMemo(() => [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[], [variants]);
  const firstInStock = variants.find((v) => v.stock > 0) ?? variants[0];
  const [color, setColor] = useState<string | null>(firstInStock?.color ?? null);
  const [size, setSize] = useState<string | null>(firstInStock?.size ?? null);
  const [qty, setQty] = useState(1);

  const find = (c: string | null, s: string | null) => variants.find((v) => (v.color ?? null) === c && (v.size ?? null) === s);
  const selected = find(color, size);
  const soldOut = !selected || selected.stock <= 0;

  const pickColor = (c: string) => {
    setColor(c);
    let v = find(c, size);
    if (!v || v.stock <= 0) { v = variants.find((x) => x.color === c && x.stock > 0) ?? variants.find((x) => x.color === c); if (v) setSize(v.size); }
    setQty(1);
    onVariantImage?.(v?.imageUrl ?? null);
  };
  const pickSize = (s: string) => { setSize(s); setQty(1); };

  const toCart = () => {
    if (!selected || soldOut) return false;
    add({
      variantId: selected.id, productId: product.id, slug: product.slug, name: product.name,
      variantLabel: variantLabel(selected), image: selected.imageUrl ?? product.image, price: selected.price,
      compareAtPrice: selected.compareAtPrice, maxStock: selected.stock,
    }, qty);
    return true;
  };

  return (
    <div className="space-y-7">
      <div>
        <Price price={selected?.price ?? variants[0]?.price ?? 0} compareAt={selected?.compareAtPrice} size="lg" />
        <p className={cn("mt-2 text-xs uppercase tracking-[0.16em]", soldOut ? "text-rose-700" : selected!.stock < 5 ? "text-gold-dark" : "text-emerald-700")} aria-live="polite">
          {soldOut ? "Sold out" : selected!.stock < 5 ? `Only ${selected!.stock} left` : "In stock · ready to ship"}
        </p>
      </div>

      {colors.length > 0 && (
        <OptionGroup label={product.colorLabel ?? "Colour"} value={color}>
          {colors.map((c) => {
            const available = variants.some((v) => v.color === c && v.stock > 0);
            return <OptionButton key={c} active={c === color} disabled={!available} onClick={() => pickColor(c)}>{c}{!available && <SoldTag />}</OptionButton>;
          })}
        </OptionGroup>
      )}
      {sizes.length > 0 && (
        <OptionGroup label={product.sizeLabel ?? "Size"} value={size} extra={product.sizeGuide === "belt" || product.sizeGuide === "backpack" ? <SizeGuide kind={product.sizeGuide} /> : null}>
          {sizes.map((s) => {
            const v = find(colors.length ? color : null, s);
            const available = !!v && v.stock > 0;
            return <OptionButton key={s} active={s === size} disabled={!available} onClick={() => pickSize(s)}>{s}{!available && <SoldTag />}</OptionButton>;
          })}
        </OptionGroup>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <QtyPicker value={qty} max={selected?.stock ?? 1} onChange={setQty} />
        <Button className="flex-1" disabled={soldOut} onClick={() => { if (toCart()) { toast.success("Added to your bag"); useCart.getState().open(); } }}>
          {soldOut ? "Sold Out" : "Add to Bag"}
        </Button>
      </div>
      <Button variant="gold" className="w-full" disabled={soldOut} onClick={() => { if (toCart()) router.push("/checkout"); }}>Buy Now · Cash on Delivery</Button>
      <WishlistButton withLabel item={{ productId: product.id, slug: product.slug, name: product.name, image: product.image, price: selected?.price ?? 0 }}
        className="text-xs uppercase tracking-[0.16em] hover:text-gold-dark" />
      {selected && <p className="text-xs text-warm-dark">SKU: {selected.sku}</p>}

      <ul className="space-y-3 border-t border-border pt-6 text-sm text-warm-dark">
        <li className="flex gap-3"><Truck className="h-4 w-4 shrink-0 text-gold" />Delivery in 1–5 working days across all 64 districts.</li>
        <li className="flex gap-3"><Banknote className="h-4 w-4 shrink-0 text-gold" />Cash on Delivery — pay when it arrives.</li>
        <li className="flex gap-3"><RefreshCcw className="h-4 w-4 shrink-0 text-gold" />7-day exchange on unused items in original packaging.</li>
      </ul>
    </div>
  );
}

function OptionGroup({ label, value, extra, children }: { label: string; value: string | null; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <fieldset>
      <div className="mb-3 flex items-center justify-between">
        <legend className="text-[11px] font-medium uppercase tracking-[0.18em]">{label}: <span className="font-normal text-warm-dark">{value ?? "—"}</span></legend>
        {extra}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}
function OptionButton({ active, disabled, onClick, children }: { active: boolean; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={active} disabled={disabled} onClick={onClick}
      className={cn("relative min-w-12 border px-4 py-2.5 text-sm transition-colors",
        active ? "border-obsidian bg-obsidian text-white" : "border-border hover:border-obsidian",
        disabled && "cursor-not-allowed border-dashed text-warm line-through decoration-warm/70 hover:border-border")}>
      {children}
    </button>
  );
}
function SoldTag() { return <span className="ml-1.5 text-[9px] uppercase tracking-wider no-underline">Sold Out</span>; }
