"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Card } from "./ui";
import { ImageUploader } from "./image-uploader";
import { TagInput } from "./tag-input";
import { RichTextEditor } from "./rich-text-editor";
import { deletePost, savePost } from "@/actions/content";

type P = { title: string; slug: string; excerpt: string; coverImage: string; body: string; tags: string[]; published: boolean };

export function PostForm({ id, initial }: { id: string | null; initial: P }) {
  const router = useRouter();
  const [f, setF] = useState(initial);
  const [pending, start] = useTransition();
  const set = <K extends keyof P>(k: K, v: P[K]) => setF((s) => ({ ...s, [k]: v }));
  const submit = () => start(async () => {
    const r = await savePost(id, f);
    if (!r.ok) return void toast.error(r.error);
    toast.success("Post saved");
    if (!id && r.id) router.replace(`/admin/journal/${r.id}`); else router.refresh();
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <Card>
          <div className="space-y-4">
            <Field label="Title" htmlFor="po-t"><Input id="po-t" value={f.title} onChange={(e) => set("title", e.target.value)} required /></Field>
            <Field label="Excerpt" htmlFor="po-e"><Textarea id="po-e" rows={2} value={f.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></Field>
            <div><p className="mb-1.5 text-[11px] uppercase tracking-[0.16em] text-warm-dark">Body</p><RichTextEditor value={f.body} onChange={(v) => set("body", v)} /></div>
          </div>
        </Card>
      </div>
      <div className="space-y-4">
        <Card title="Publish">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-obsidian" checked={f.published} onChange={(e) => set("published", e.target.checked)} />Published</label>
            <Field label="Slug (auto if empty)" htmlFor="po-s"><Input id="po-s" value={f.slug} onChange={(e) => set("slug", e.target.value)} /></Field>
            <Field label="Tags" htmlFor="po-tags"><TagInput id="po-tags" value={f.tags} onChange={(v) => set("tags", v)} /></Field>
            <Button type="submit" className="w-full" disabled={pending}>{pending ? "Saving…" : "Save post"}</Button>
            {id && <Button type="button" variant="destructive" size="sm" className="w-full" disabled={pending} onClick={() => {
              if (!confirm("Delete this post?")) return;
              start(async () => { await deletePost(id); router.replace("/admin/journal"); });
            }}><Trash2 />Delete</Button>}
          </div>
        </Card>
        <Card title="Cover image"><ImageUploader multiple={false} folder="journal" value={f.coverImage ? [f.coverImage] : []} onChange={(u) => set("coverImage", u[0] ?? "")} /></Card>
      </div>
    </form>
  );
}
