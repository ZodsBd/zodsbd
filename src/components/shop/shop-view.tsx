import { Suspense } from "react";
import { ProductGrid } from "@/components/product/product-card";
import { ShopSidebar, ShopToolbar } from "./filters";
import { Pagination } from "./pagination";
import { getFilterFacets, getShopProducts, parseShopParams } from "@/lib/queries/products";
import { prisma } from "@/lib/prisma";

export async function ShopView({ searchParams, categorySlug, basePath }: { searchParams: Record<string, string | string[] | undefined>; categorySlug?: string; basePath: string }) {
  const params = parseShopParams(searchParams);
  if (categorySlug) params.category = categorySlug;
  const [result, facets, categories] = await Promise.all([
    getShopProducts(params),
    getFilterFacets(params.category),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { name: true, slug: true } }),
  ]);
  const filterProps = { categories, colors: facets.colors, sizes: facets.sizes, showCategory: !categorySlug };
  return (
    <div className="container grid gap-10 py-10 lg:grid-cols-[220px_1fr] lg:py-14">
      <Suspense><ShopSidebar {...filterProps} /></Suspense>
      <div>
        <Suspense><ShopToolbar {...filterProps} total={result.total} /></Suspense>
        {params.q && <p className="mt-6 text-sm text-warm-dark">Results for “<span className="text-obsidian">{params.q}</span>”</p>}
        <div className="mt-8">
          {result.items.length ? <ProductGrid products={result.items} /> : (
            <div className="py-24 text-center">
              <p className="font-serif text-3xl">Nothing matches just yet</p>
              <p className="mt-3 text-sm text-warm-dark">Try removing a filter or searching for something else.</p>
            </div>
          )}
        </div>
        <Pagination page={result.page} pages={result.pages} basePath={basePath} params={searchParams} />
      </div>
    </div>
  );
}
