import Image from "next/image";
import Link from "next/link";
import { HeroSlider } from "@/components/home/hero-slider";
import { CategoryGrid } from "@/components/home/category-grid";
import { Carousel, CarouselItem } from "@/components/home/product-carousel";
import { TrustBadges } from "@/components/home/trust-badges";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/brand/section-heading";
import { Reveal } from "@/components/brand/reveal";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getHomeCollections, type ProductCardData } from "@/lib/queries/products";
import { getSettings } from "@/lib/settings";
import { INSTAGRAM_IMAGES, STORY_IMAGE } from "@/lib/home-images";

export const revalidate = 300;

export default async function HomePage() {
  const [banners, categories, { newArrivals, bestsellers }, settings] = await Promise.all([
    prisma.banner.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    getHomeCollections(),
    getSettings(),
  ]);
  return (
    <>
      <HeroSlider slides={banners} />

      <section className="container py-20 md:py-28">
        <Reveal><SectionHeading eyebrow="The Collections" title="Shop by Category" /></Reveal>
        <div className="mt-12"><CategoryGrid categories={categories} /></div>
      </section>

      <ProductRow eyebrow="Just Landed" title="New Arrivals" products={newArrivals} href="/shop?sort=newest" />

      <section className="my-20 bg-ivory md:my-28">
        <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:gap-20 md:py-24">
          <Reveal className="relative aspect-[4/5] overflow-hidden">
            <Image src={STORY_IMAGE} alt="Artisan hand-finishing a leather strap" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Our Story</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">Quiet luxury, made to be carried every day.</h2>
            <div className="mt-6 h-px w-16 bg-gold" />
            <p className="mt-6 leading-relaxed text-warm-dark">
              Zod&apos;s Bd began with a simple belief: the objects you carry should feel as considered as the life you lead.
              We source full-grain leathers, solid hardware and long-lasting fragrance oils, then finish every piece to a standard
              we would be proud to gift.
            </p>
            <Button asChild variant="outline" className="mt-8"><Link href="/about">Read our story</Link></Button>
          </Reveal>
        </div>
      </section>

      <ProductRow eyebrow="Most Loved" title="Bestsellers" products={bestsellers} href="/shop?sort=popular" />

      <section className="container py-16"><TrustBadges /></section>

      <section className="container py-16 md:py-24">
        <Reveal><SectionHeading eyebrow="@zodsbd" title="On Instagram" /></Reveal>
        <ul className="mt-12 grid grid-cols-3 gap-2 md:grid-cols-6">
          {INSTAGRAM_IMAGES.map((src, i) => (
            <li key={src} className="group relative aspect-square overflow-hidden bg-ivory">
              <a href={settings.instagramUrl || "https://instagram.com"} target="_blank" rel="noopener noreferrer" aria-label={`Instagram post ${i + 1}`}>
                <Image src={src} alt="" fill sizes="(min-width:768px) 16vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-obsidian py-20 text-white md:py-24">
        <Reveal className="container max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-luxe text-gold">The Zod&apos;s Circle</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">First access to new collections</h2>
          <p className="mt-4 text-sm text-white/70">Private previews, restocks and members-only offers. No spam, ever.</p>
          <div className="mx-auto mt-8 max-w-md"><NewsletterForm dark /></div>
        </Reveal>
      </section>
    </>
  );
}

function ProductRow({ eyebrow, title, products, href }: { eyebrow: string; title: string; products: ProductCardData[]; href: string }) {
  if (!products.length) return null;
  return (
    <section className="container py-12 md:py-16">
      <Reveal className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow={eyebrow} title={title} align="left" className="text-center md:text-left [&>div]:mx-auto md:[&>div]:mx-0" />
        <Link href={href} className="border-b border-obsidian pb-0.5 text-[11px] uppercase tracking-[0.2em] hover:border-gold hover:text-gold-dark">View all</Link>
      </Reveal>
      <div className="mt-8">
        <Carousel label={title}>
          {products.map((p) => <CarouselItem key={p.id}><ProductCard product={p} /></CarouselItem>)}
        </Carousel>
      </div>
    </section>
  );
}
