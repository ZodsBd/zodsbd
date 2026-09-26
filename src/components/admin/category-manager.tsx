"use client";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageUploader } from "./image-uploader";
import { ActionButton } from "./confirm-button";
import { Table, Td } from "./ui";
import { deleteCategory, saveCategory } from "@/actions/content";

type Cat = { id: string; name: string; slug: string; description: string | null; image: string | null; sortOrder: number; _count: { products: number } };
const empty = { name: "", slug: "", description: "", image: "", sortOrder: 0 };

export function CategoryManager({ categories }: { categories: Cat[] }) {
  const [edit, setEdit] = useState<{ id: string | null; v: typeof empty } | null>(null);
  const [pending, start] = useTransition();
  const save = () => edit && start(async () => {
    const r = await saveCategory(edit.id, edit.v);
    if (!r.ok) return void toast.error(r.error);
    toast.success("Saved"); setEdit(null);
  });
  return (
    <>
      <div className="mb-4 flex justify-end"><Button size="sm" onClick={() => setEdit({ id: null, v: { ...empty, sortOrder: categories.length } })}><Plus />Add category</Button></div>
      <Table head={["", "Name", "Slug", "Products", "Order", ""]} empty={!categories.length}>
        {categories.map((c) => (
          <tr key={c.id}>
            <Td><div className="relative h-12 w-12 bg-ivory">{c.image && <Image src={c.image} alt="" fill sizes="48px" className="object-cover" />}</div></Td>
            <Td className="font-medium">{c.name}</Td>
            <Td className="text-warm-dark">/{c.slug}</Td>
            <Td>{c._count.products}</Td>
            <Td>{c.sortOrder}</Td>
            <Td className="text-right">
              <Button variant="ghost" size="sm" onClick={() => setEdit({ id: c.id, v: { name: c.name, slug: c.slug, description: c.description ?? "", image: c.image ?? "", sortOrder: c.sortOrder } })}><Pencil /></Button>
              <ActionButton variant="ghost" size="sm" action={() => deleteCategory(c.id)} confirmText={`Delete ${c.name}?`} success="Deleted" aria-label="Delete"><Trash2 /></ActionButton>
            </Td>
          </tr>
        ))}
      </Table>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent title={edit?.id ? "Edit category" : "New category"}>
          {edit && (
            <form className="space-y-4 p-6" onSubmit={(e) => { e.preventDefault(); save(); }}>
              <Field label="Name" htmlFor="c-name"><Input id="c-name" value={edit.v.name} onChange={(e) => setEdit({ ...edit, v: { ...edit.v, name: e.target.value } })} required /></Field>
              <Field label="Slug (auto if empty)" htmlFor="c-slug"><Input id="c-slug" value={edit.v.slug} onChange={(e) => setEdit({ ...edit, v: { ...edit.v, slug: e.target.value } })} /></Field>
              <Field label="Description" htmlFor="c-desc"><Textarea id="c-desc" rows={2} value={edit.v.description} onChange={(e) => setEdit({ ...edit, v: { ...edit.v, description: e.target.value } })} /></Field>
              <Field label="Sort order" htmlFor="c-sort"><Input id="c-sort" type="number" value={edit.v.sortOrder} onChange={(e) => setEdit({ ...edit, v: { ...edit.v, sortOrder: Number(e.target.value) } })} /></Field>
              <div><p className="mb-1.5 text-[11px] uppercase tracking-[0.16em] text-warm-dark">Image</p><ImageUploader multiple={false} folder="categories" value={edit.v.image ? [edit.v.image] : []} onChange={(u) => setEdit({ ...edit, v: { ...edit.v, image: u[0] ?? "" } })} /></div>
              <Button type="submit" disabled={pending} className="w-full">{pending ? "Saving…" : "Save"}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
