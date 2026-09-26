import type { Metadata } from "next";
import { PageHeader } from "@/components/brand/section-heading";
import { ShopView } from "@/components/shop/shop-view";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Explore luxury backpacks, leather belts, cigarette cases, perfumes and clutch bags. Cash on delivery across Bangladesh.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  return (
    <>
      <PageHeader eyebrow="The Collection" title="Shop All" intro="Every piece, considered. Filter by what matters to you." />
      <ShopView searchParams={sp} basePath="/shop" />
    </>
  );
}
