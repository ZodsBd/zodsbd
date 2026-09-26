import type { Metadata } from "next";
import { PageHeader } from "@/components/brand/section-heading";
import { WishlistView } from "@/components/product/wishlist-view";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <>
      <PageHeader eyebrow="Saved" title="Wishlist" />
      <WishlistView />
    </>
  );
}
