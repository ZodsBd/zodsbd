import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { AdminPage, PageLinks, Table, Td } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { formatBDT } from "@/lib/money";

export const metadata = { title: "Products" };
const PER = 25;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; status?: string; stock?: string; page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const where: Prisma.ProductWhereInput = {
    ...(sp.q ? { OR: [{ name: { contains: sp.q, mode: "insensitive" } }, { variants: { some: { sku: { contains: sp.q.toUpperCase() } } } }] } : {}),
    ...(sp.category ? { categoryId: sp.category } : {}),
    ...(sp.status === "ACTIVE" || sp.status === "DRAFT" ? { status: sp.status } : {}),
    ...(sp.stock === "low" ? { variants: { some: { stock: { lt: 5 } } } } : sp.stock === "out" ? { totalStock: 0 } : {}),
  };
  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({ where, orderBy: { updatedAt: "desc" }, skip: (page - 1) * PER, take: PER, include: { category: true, images: { take: 1, orderBy: { sortOrder: "asc" } }, _count: { select: { variants: true } } } }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  const href = (p: number) => `/admin/products?${new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).filter(([, v]) => v)), page: String(p) })}`;
  return (
    <AdminPage title="Products" description={`${total} products`} actions={<Button asChild size="sm"><Link href="/admin/products/new"><Plus />Add product</Link></Button>}>
      <form className="mb-4 grid gap-3 rounded border border-border bg-white p-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <Input name="q" defaultValue={sp.q} placeholder="Search name or SKU" aria-label="Search" />
        <Select name="category" defaultValue={sp.category ?? ""} aria-label="Category"><option value="">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
        <Select name="status" defaultValue={sp.status ?? ""} aria-label="Status"><option value="">Any status</option><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option></Select>
        <Select name="stock" defaultValue={sp.stock ?? ""} aria-label="Stock"><option value="">Any stock</option><option value="low">Low (&lt;5)</option><option value="out">Out of stock</option></Select>
        <Button type="submit" className="h-11">Filter</Button>
      </form>
      <Table head={["", "Product", "Category", "Price", "Stock", "Variants", "Status"]} empty={!products.length}>
        {products.map((p) => (
          <tr key={p.id} className="hover:bg-ivory/40">
            <Td><div className="relative h-12 w-10 bg-ivory">{p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="40px" className="object-cover" />}</div></Td>
            <Td><Link href={`/admin/products/${p.id}`} className="font-medium hover:underline">{p.name}</Link><div className="mt-0.5 flex gap-1">{p.isBestseller && <Badge className="border-gold text-gold-dark">Bestseller</Badge>}{p.isFeatured && <Badge className="border-border">Featured</Badge>}</div></Td>
            <Td>{p.category.name}</Td>
            <Td>{p.minPrice === p.maxPrice ? formatBDT(p.minPrice) : `${formatBDT(p.minPrice)} – ${formatBDT(p.maxPrice)}`}{p.onSale && <span className="ml-1 text-xs text-gold-dark">sale</span>}</Td>
            <Td className={p.totalStock === 0 ? "text-rose-700" : p.totalStock < 10 ? "text-amber-700" : ""}>{p.totalStock}</Td>
            <Td>{p._count.variants}</Td>
            <Td><Badge className={p.status === "ACTIVE" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-border text-warm-dark"}>{p.status}</Badge></Td>
          </tr>
        ))}
      </Table>
      <PageLinks page={page} pages={Math.ceil(total / PER)} href={href} />
    </AdminPage>
  );
}
