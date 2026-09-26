"use client";
import { useState } from "react";
import { Gallery } from "./gallery";
import { PurchasePanel, type PanelVariant } from "./purchase-panel";

type Props = {
  product: { id: string; slug: string; name: string; colorLabel: string | null; sizeLabel: string | null; sizeGuide: string | null };
  images: { url: string; alt: string | null }[];
  variants: PanelVariant[];
  header: React.ReactNode;
  details: React.ReactNode;
};

export function ProductView({ product, images, variants, header, details }: Props) {
  const [activeImg, setActiveImg] = useState<string | null>(null);
  // variant images join the gallery so selecting a colour can switch to it
  const all = [...images];
  variants.forEach((v) => { if (v.imageUrl && !all.some((i) => i.url === v.imageUrl)) all.push({ url: v.imageUrl, alt: `${product.name} — ${v.color ?? ""}` }); });
  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <Gallery images={all} name={product.name} activeUrl={activeImg} />
      <div className="lg:sticky lg:top-28 lg:self-start">
        {header}
        <div className="mt-8"><PurchasePanel product={{ ...product, image: images[0]?.url ?? null }} variants={variants} onVariantImage={setActiveImg} /></div>
        <div className="mt-10">{details}</div>
      </div>
    </div>
  );
}
