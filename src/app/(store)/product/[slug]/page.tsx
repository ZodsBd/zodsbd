import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ProductView } from "@/components/product/product-view";
import { Reviews } from "@/components/product/reviews";
import { ProductCard } from "@/components/product/product-card";
import { Carousel, CarouselItem } from "@/components/home/product-carousel";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Stars } from "@/components/brand/stars";
import { SectionHeading } from "@/components/brand/section-heading";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { getProductBySlug, getRelated } from "@/lib/queries/products";
import { getSettings } from "@/lib/settings";
import { formatBDT } from "@/lib/money";
import { siteUrl } from "@/lib/utils";

export const revalidate = 120;

const load = cache((slug: string) => getProductBySlug(slug));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await load((await params).slug);
  if (!p) return {};
  const desc = p.shortDescription ?? p.description.slice(0, 155);
  return {
    title: p.name,
    description: `${desc} From ${formatBDT(p.minPrice)}. Cash on delivery across Bangladesh.`,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: p.name, description: desc, type: "website" },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await load(slug);
  if (!p) notFound();
  const [related, settings] = await Promise.all([getRelated(p.id, p.categoryId), getSettings()]);
  const specs = (Array.isArray(p.specs) ? p.specs : []) as { label: string; value: string }[];

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.shortDescription ?? p.description,
    image: p.images.map((i) => i.url),
    sku: p.variants[0]?.sku,
    brand: { "@type": "Brand", name: "Zod's Bd" },
    category: p.category.name,
    url: siteUrl(`/product/${p.slug}`),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BDT",
      lowPrice: p.minPrice,
      highPrice: p.maxPrice,
      offerCount: p.variants.length,
      availability: p.totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(p.ratingCount > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.ratingAvg, reviewCount: p.ratingCount, bestRating: 5, worstRating: 1 } } : {}),
    ...(p.reviews.length ? { review: p.reviews.slice(0, 5).map((r) => ({ "@type": "Review", author: { "@type": "Person", name: r.name }, reviewRating: { "@type": "Rating", ratingValue: r.rating }, reviewBody: r.comment })) } : {}),
  };

  return (
    <div className="container py-8 md:py-12">
      <JsonLd data={ld} />
      <Breadcrumbs items={[{ name: p.category.name, path: `/category/${p.category.slug}` }, { name: p.name, path: `/product/${p.slug}` }]} />
      <div className="mt-8">
        <ProductView
          product={{ id: p.id, slug: p.slug, name: p.name, colorLabel: p.colorLabel, sizeLabel: p.sizeLabel, sizeGuide: p.sizeGuide }}
          images={p.images.map((i) => ({ url: i.url, alt: i.alt }))}
          variants={p.variants.map((v) => ({ id: v.id, sku: v.sku, color: v.color, size: v.size, price: v.price, compareAtPrice: v.compareAtPrice, stock: v.stock, imageUrl: v.imageUrl }))}
          header={
            <div>
              <p className="eyebrow">{p.category.name}</p>
              <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{p.name}</h1>
              {p.ratingCount > 0 && <a href="#reviews" className="mt-3 inline-block"><Stars value={p.ratingAvg} count={p.ratingCount} /></a>}
              {p.shortDescription && <p className="mt-4 leading-relaxed text-warm-dark">{p.shortDescription}</p>}
            </div>
          }
          details={
            <Accordion type="multiple" defaultValue={["desc"]}>
              <AccordionItem value="desc" title="Description"><div className="whitespace-pre-line">{p.description}</div></AccordionItem>
              {specs.length > 0 && (
                <AccordionItem value="specs" title="Specifications">
                  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                    {specs.map((s) => <div key={s.label} className="contents"><dt className="font-medium text-obsidian">{s.label}</dt><dd>{s.value}</dd></div>)}
                  </dl>
                </AccordionItem>
              )}
              <AccordionItem value="delivery" title="Delivery & Returns">
                <p>Inside Dhaka {formatBDT(settings.shippingInsideDhaka)} · Dhaka Sub-urban {formatBDT(settings.shippingSubDhaka)} · Outside Dhaka {formatBDT(settings.shippingOutsideDhaka)}.</p>
                <p className="mt-2">Cash on delivery nationwide. Exchanges accepted within 7 days of delivery for unused items with tags and original packaging. Perfumes are exchangeable only if unopened.</p>
              </AccordionItem>
            </Accordion>
          }
        />
      </div>
      <Reviews productId={p.id} reviews={p.reviews} avg={p.ratingAvg} count={p.ratingCount} />
      {related.length > 0 && (
        <section className="border-t border-border py-16">
          <SectionHeading eyebrow="Curated for you" title="You May Also Like" />
          <div className="mt-6">
            <Carousel label="Related products">{related.map((r) => <CarouselItem key={r.id}><ProductCard product={r} /></CarouselItem>)}</Carousel>
          </div>
        </section>
      )}
    </div>
  );
}
