"use client";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Minus, Quote, Redo, Undo } from "lucide-react";
import { cn } from "@/lib/utils";

export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } }), Link.configure({ openOnClick: false })],
    content: value,
    immediatelyRender: false,
    editorProps: { attributes: { class: "prose-luxe min-h-[320px] px-4 py-3 outline-none" } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  return (
    <div className="rounded border border-border bg-white">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const btn = (active: boolean, onClick: () => void, Icon: typeof Bold, label: string) => (
    <button type="button" onClick={onClick} aria-label={label} aria-pressed={active} className={cn("rounded p-1.5 hover:bg-ivory", active && "bg-ivory text-gold-dark")}><Icon className="h-4 w-4" /></button>
  );
  const c = () => editor.chain().focus();
  return (
    <div className="flex flex-wrap gap-0.5 border-b border-border p-1.5">
      {btn(editor.isActive("bold"), () => c().toggleBold().run(), Bold, "Bold")}
      {btn(editor.isActive("italic"), () => c().toggleItalic().run(), Italic, "Italic")}
      {btn(editor.isActive("heading", { level: 2 }), () => c().toggleHeading({ level: 2 }).run(), Heading2, "Heading 2")}
      {btn(editor.isActive("heading", { level: 3 }), () => c().toggleHeading({ level: 3 }).run(), Heading3, "Heading 3")}
      {btn(editor.isActive("bulletList"), () => c().toggleBulletList().run(), List, "Bullet list")}
      {btn(editor.isActive("orderedList"), () => c().toggleOrderedList().run(), ListOrdered, "Numbered list")}
      {btn(editor.isActive("blockquote"), () => c().toggleBlockquote().run(), Quote, "Quote")}
      {btn(false, () => c().setHorizontalRule().run(), Minus, "Divider")}
      {btn(editor.isActive("link"), () => {
        const prev = editor.getAttributes("link").href as string | undefined;
        const url = window.prompt("Link URL", prev ?? "https://");
        if (url === null) return;
        if (!url) c().unsetLink().run(); else c().extendMarkRange("link").setLink({ href: url }).run();
      }, Link2, "Link")}
      <span className="mx-1 w-px bg-border" />
      {btn(false, () => c().undo().run(), Undo, "Undo")}
      {btn(false, () => c().redo().run(), Redo, "Redo")}
    </div>
  );
}
