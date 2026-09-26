import { AdminPage } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "New product" };

export default async function NewProduct() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true, slug: true } });
  return (
    <AdminPage title="New product">
      <ProductForm id={null} categories={categories} initial={{
        name: "", slug: "", shortDescription: "", description: "", categoryId: "", tags: [], specs: [], status: "DRAFT",
        isFeatured: false, isBestseller: false, colorLabel: "Colour", sizeLabel: null, sizeGuide: null, images: [], variants: [],
      }} />
    </AdminPage>
  );
}
