import Image from "next/image";
import Link from "next/link";
import type { ProductCardData } from "@/lib/queries/products";
import { Price } from "@/components/brand/price";
import { Stars } from "@/components/brand/stars";
import { WishlistButton } from "./wishlist-button";
import { discountPercent } from "@/lib/money";

export function ProductCard({ product, priority }: { product: ProductCardData; priority?: boolean }) {
  const [img, hover] = product.images;
  const soldOut = product.totalStock <= 0;
  const off = discountPercent(product.minPrice, product.minCompareAt);
  return (
    <article className="group relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
          {img && (
            <Image src={img.url} alt={img.alt || product.name} fill priority={priority}
              sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
          )}
          {hover && (
            <Image src={hover.url} alt="" aria-hidden fill sizes="(min-width:1024px) 25vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          )}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {off > 0 && !soldOut && <span className="bg-gold px-2 py-1 text-[10px] font-semibold text-obsidian">-{off}%</span>}
            {soldOut && <span className="bg-obsidian px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white">Sold Out</span>}
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-warm-dark">{product.category.name}</p>
          <h3 className="font-serif text-lg leading-snug text-obsidian group-hover:text-gold-dark">{product.name}</h3>
          <Price price={product.minPrice} compareAt={product.minCompareAt} />
          {product.ratingCount > 0 && <Stars value={product.ratingAvg} count={product.ratingCount} size={12} />}
        </div>
      </Link>
      <WishlistButton
        item={{ productId: product.id, slug: product.slug, name: product.name, image: img?.url ?? null, price: product.minPrice }}
        className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 text-obsidian shadow-sm hover:text-gold"
      />
    </article>
  );
}

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
      {products.map((p, i) => <li key={p.id}><ProductCard product={p} priority={i < 4} /></li>)}
    </ul>
  );
}
