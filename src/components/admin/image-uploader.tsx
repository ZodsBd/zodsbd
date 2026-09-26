"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, Link2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export async function uploadFiles(files: File[], folder: string): Promise<string[]> {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));
  fd.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.urls as string[];
}

/** Multi-image uploader to Vercel Blob with drag-reorder. First image = cover. */
export function ImageUploader({ value, onChange, folder = "products", multiple = true }: { value: string[]; onChange: (urls: string[]) => void; folder?: string; multiple?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleFiles = async (list: FileList | null) => {
    if (!list?.length) return;
    setBusy(true);
    try {
      const urls = await uploadFiles(Array.from(list), folder);
      onChange(multiple ? [...value, ...urls] : urls.slice(0, 1));
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
    finally { setBusy(false); if (inputRef.current) inputRef.current.value = ""; }
  };
  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    onChange(arrayMove(value, value.indexOf(String(e.active.id)), value.indexOf(String(e.over.id))));
  };
  const addUrl = () => {
    try { new URL(url); } catch { return toast.error("Enter a valid image URL"); }
    onChange(multiple ? [...value, url] : [url]); setUrl("");
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={value} strategy={rectSortingStrategy}>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {value.map((u, i) => <Thumb key={u} url={u} cover={i === 0 && multiple} onRemove={() => onChange(value.filter((x) => x !== u))} />)}
            {(multiple || value.length === 0) && (
              <li>
                <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
                  className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded border-2 border-dashed border-border text-xs text-warm-dark hover:border-obsidian"
                  onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); void handleFiles(e.dataTransfer.files); }}>
                  {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}{busy ? "Uploading" : "Upload"}
                </button>
              </li>
            )}
          </ul>
        </SortableContext>
      </DndContext>
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} hidden onChange={(e) => void handleFiles(e.target.files)} />
      <div className="flex gap-2">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="…or paste an image URL" className="h-9" aria-label="Image URL" />
        <Button type="button" variant="outline" size="sm" onClick={addUrl}><Link2 />Add</Button>
      </div>
      {multiple && value.length > 1 && <p className="text-xs text-warm-dark">Drag to reorder. The first image is the cover.</p>}
    </div>
  );
}

function Thumb({ url, cover, onRemove }: { url: string; cover: boolean; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url });
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`relative aspect-square overflow-hidden rounded border border-border bg-ivory ${isDragging ? "z-10 opacity-70" : ""}`}>
      <Image src={url} alt="" fill sizes="120px" className="object-cover" />
      <button type="button" {...attributes} {...listeners} aria-label="Drag to reorder" className="absolute left-1 top-1 cursor-grab rounded bg-white/90 p-1"><GripVertical className="h-3.5 w-3.5" /></button>
      <button type="button" onClick={onRemove} aria-label="Remove image" className="absolute right-1 top-1 rounded bg-white/90 p-1 hover:text-rose-700"><X className="h-3.5 w-3.5" /></button>
      {cover && <span className="absolute inset-x-0 bottom-0 bg-obsidian/80 py-0.5 text-center text-[10px] uppercase tracking-wider text-white">Cover</span>}
    </li>
  );
}
