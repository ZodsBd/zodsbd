"use client";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageUploader } from "./image-uploader";
import { ActionButton } from "./confirm-button";
import { deleteBanner, reorderBanners, saveBanner } from "@/actions/content";

type B = { id: string; image: string; heading: string; subheading: string | null; ctaText: string | null; ctaLink: string | null; isActive: boolean };
const blank = { image: "", heading: "", subheading: "", ctaText: "Shop Now", ctaLink: "/shop", isActive: true };

export function BannerManager({ banners }: { banners: B[] }) {
  const [list, setList] = useState(banners);
  useEffect(() => setList(banners), [banners]);
  const [edit, setEdit] = useState<{ id: string | null; v: typeof blank } | null>(null);
  const [pending, start] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const next = arrayMove(list, list.findIndex((b) => b.id === e.active.id), list.findIndex((b) => b.id === e.over!.id));
    setList(next);
    start(async () => { const r = await reorderBanners(next.map((b) => b.id)); if (!r.ok) toast.error(r.error); else toast.success("Order saved"); });
  };
  const save = () => edit && start(async () => {
    const r = await saveBanner(edit.id, edit.v);
    if (!r.ok) return void toast.error(r.error);
    toast.success("Banner saved"); setEdit(null);
  });
  return (
    <>
      <div className="mb-4 flex justify-end"><Button size="sm" onClick={() => setEdit({ id: null, v: blank })}><Plus />Add slide</Button></div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={list.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3">
            {list.map((b) => <Row key={b.id} b={b} onEdit={() => setEdit({ id: b.id, v: { image: b.image, heading: b.heading, subheading: b.subheading ?? "", ctaText: b.ctaText ?? "", ctaLink: b.ctaLink ?? "", isActive: b.isActive } })} />)}
            {!list.length && <li className="rounded border border-border bg-white p-10 text-center text-sm text-warm-dark">No slides yet.</li>}
          </ul>
        </SortableContext>
      </DndContext>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent title={edit?.id ? "Edit slide" : "New slide"}>
          {edit && (
            <form className="space-y-4 p-6" onSubmit={(e) => { e.preventDefault(); save(); }}>
              <div><p className="mb-1.5 text-[11px] uppercase tracking-[0.16em] text-warm-dark">Image (wide, ≥1920px)</p><ImageUploader multiple={false} folder="banners" value={edit.v.image ? [edit.v.image] : []} onChange={(u) => setEdit({ ...edit, v: { ...edit.v, image: u[0] ?? "" } })} /></div>
              <Field label="Heading" htmlFor="b-h"><Input id="b-h" value={edit.v.heading} onChange={(e) => setEdit({ ...edit, v: { ...edit.v, heading: e.target.value } })} required /></Field>
              <Field label="Subheading" htmlFor="b-s"><Input id="b-s" value={edit.v.subheading} onChange={(e) => setEdit({ ...edit, v: { ...edit.v, subheading: e.target.value } })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="CTA text" htmlFor="b-ct"><Input id="b-ct" value={edit.v.ctaText} onChange={(e) => setEdit({ ...edit, v: { ...edit.v, ctaText: e.target.value } })} /></Field>
                <Field label="CTA link" htmlFor="b-cl"><Input id="b-cl" value={edit.v.ctaLink} onChange={(e) => setEdit({ ...edit, v: { ...edit.v, ctaLink: e.target.value } })} placeholder="/category/belts" /></Field>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-obsidian" checked={edit.v.isActive} onChange={(e) => setEdit({ ...edit, v: { ...edit.v, isActive: e.target.checked } })} />Active</label>
              <Button type="submit" disabled={pending} className="w-full">{pending ? "Saving…" : "Save slide"}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({ b, onEdit }: { b: B; onEdit: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: b.id });
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className="flex items-center gap-4 rounded border border-border bg-white p-3">
      <button {...attributes} {...listeners} aria-label="Drag to reorder" className="cursor-grab p-1 text-warm-dark"><GripVertical className="h-5 w-5" /></button>
      <div className="relative h-16 w-28 shrink-0 overflow-hidden bg-ivory"><Image src={b.image} alt="" fill sizes="112px" className="object-cover" /></div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{b.heading}</p>
        <p className="truncate text-xs text-warm-dark">{b.subheading} {b.ctaLink && `→ ${b.ctaLink}`}</p>
      </div>
      <Badge className={b.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-border text-warm-dark"}>{b.isActive ? "Active" : "Hidden"}</Badge>
      <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Edit"><Pencil /></Button>
      <ActionButton variant="ghost" size="sm" action={() => deleteBanner(b.id)} confirmText="Delete this slide?" success="Deleted" aria-label="Delete"><Trash2 /></ActionButton>
    </li>
  );
}
