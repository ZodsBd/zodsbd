"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Horizontal scroll-snap carousel. Children are rendered server-side and passed in. */
export function Carousel({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="relative">
      <div className="mb-6 flex justify-end gap-2">
        <button onClick={() => scroll(-1)} aria-label={`Scroll ${label} left`} className="flex h-10 w-10 items-center justify-center border border-border hover:border-obsidian"><ChevronLeft className="h-4 w-4" /></button>
        <button onClick={() => scroll(1)} aria-label={`Scroll ${label} right`} className="flex h-10 w-10 items-center justify-center border border-border hover:border-obsidian"><ChevronRight className="h-4 w-4" /></button>
      </div>
      <ul ref={ref} aria-label={label} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:gap-6 lg:mx-0 lg:px-0">
        {children}
      </ul>
    </div>
  );
}

export function CarouselItem({ children }: { children: React.ReactNode }) {
  return <li className="w-[62%] shrink-0 snap-start sm:w-[40%] lg:w-[calc(25%-18px)]">{children}</li>;
}
