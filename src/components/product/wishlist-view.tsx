"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/store/wishlist";
import { useHydrated } from "@/store/use-hydrated";
import { formatBDT } from "@/lib/money";

export function WishlistView() {
  const hydrated = useHydrated();
  const items = useWishlist((s) => s.items);
  const remove = useWishlist((s) => s.remove);
  if (!hydrated) return <div className="min-h-[40vh]" />;
  if (!items.length)
    return (
      <div className="container flex min-h-[40vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <Heart className="h-10 w-10 text-warm" />
        <p className="font-serif text-3xl">Nothing saved yet</p>
        <Button asChild><Link href="/shop">Discover the collection</Link></Button>
      </div>
    );
  return (
    <div className="container py-12">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
        {items.map((i) => (
          <li key={i.productId} className="group relative">
            <Link href={`/product/${i.slug}`}>
              <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
                {i.image && <Image src={i.image} alt={i.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
              </div>
              <h2 className="mt-4 font-serif text-lg">{i.name}</h2>
              <p className="text-sm">{formatBDT(i.price)}</p>
            </Link>
            <button onClick={() => remove(i.productId)} aria-label={`Remove ${i.name}`} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90"><X className="h-4 w-4" /></button>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full"><Link href={`/product/${i.slug}`}>Choose options</Link></Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
