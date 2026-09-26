import { AdminPage } from "@/components/admin/ui";
import { CategoryManager } from "@/components/admin/category-manager";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } });
  return <AdminPage title="Categories"><CategoryManager categories={categories} /></AdminPage>;
}
