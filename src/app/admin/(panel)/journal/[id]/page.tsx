import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin/ui";
import { PostForm } from "@/components/admin/post-form";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Edit post" };

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const p = await prisma.post.findUnique({ where: { id: (await params).id } });
  if (!p) notFound();
  return <AdminPage title={p.title}><PostForm id={p.id} initial={{ title: p.title, slug: p.slug, excerpt: p.excerpt ?? "", coverImage: p.coverImage, body: p.body, tags: p.tags, published: p.published }} /></AdminPage>;
}
