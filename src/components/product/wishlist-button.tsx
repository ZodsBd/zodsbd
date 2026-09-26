"use client";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { type WishItem, useWishlist } from "@/store/wishlist";
import { useHydrated } from "@/store/use-hydrated";
import { cn } from "@/lib/utils";

export function WishlistButton({ item, className, withLabel }: { item: WishItem; className?: string; withLabel?: boolean }) {
  const hydrated = useHydrated();
  const active = useWishlist((s) => s.items.some((i) => i.productId === item.productId));
  const toggle = useWishlist((s) => s.toggle);
  const on = hydrated && active;
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(item); toast(on ? "Removed from wishlist" : "Saved to wishlist"); }}
      className={cn("inline-flex items-center justify-center gap-2", className)}
    >
      <Heart className={cn("h-4 w-4 transition-colors", on ? "fill-gold text-gold" : "")} />
      {withLabel && <span>{on ? "In Wishlist" : "Add to Wishlist"}</span>}
    </button>
  );
}
