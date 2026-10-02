"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Gallery({ images, name, activeUrl }: { images: { url: string; alt: string | null }[]; name: string; activeUrl?: string | null }) {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!activeUrl) return;
    const i = images.findIndex((im) => im.url === activeUrl);
    if (i >= 0) setIdx(i);
  }, [activeUrl, images]);
  const current = images[idx] ?? images[0];
  if (!current) return <div className="aspect-[4/5] bg-ivory" />;
  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {images.length > 1 && (
        <ul className="no-scrollbar flex gap-3 overflow-x-auto md:max-h-[520px] md:flex-col md:overflow-y-auto" aria-label="Product images">
          {images.map((im, i) => (
            <li key={im.url}>
              <button onClick={() => setIdx(i)} aria-label={`Show image ${i + 1}`} aria-current={i === idx}
                className={cn("relative block h-24 w-20 shrink-0 overflow-hidden bg-ivory ring-offset-2", i === idx ? "ring-1 ring-obsidian" : "opacity-70 hover:opacity-100")}>
                <Image src={im.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div
        className="relative aspect-[4/3] min-w-0 flex-1 cursor-zoom-in overflow-hidden bg-ivory"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <Image src={current.url} alt={current.alt || name} fill priority sizes="(min-width:1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-200"
          style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
      </div>
    </div>
  );
}
