"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Slide = { id: string; image: string; heading: string; subheading: string | null; ctaText: string | null; ctaLink: string | null };

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);
  useEffect(() => {
    if (n < 2 || paused) return;
    const t = setInterval(() => go(1), 6500);
    return () => clearInterval(t);
  }, [n, paused, go]);
  if (!n) return null;
  const s = slides[i];
  return (
    <section aria-roledescription="carousel" aria-label="Featured collections" className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-obsidian"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <AnimatePresence mode="sync">
        <motion.div key={s.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1, ease: "easeOut" }}>
          <Image src={s.image} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/10" />
        </motion.div>
      </AnimatePresence>
      <div className="container relative flex h-full items-end pb-20 md:items-center md:pb-0">
        <motion.div key={`t-${s.id}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25 }} className="max-w-xl text-white" aria-live="polite">
          <p className="mb-4 text-[11px] uppercase tracking-luxe text-gold">Zod&apos;s Bd · Collection</p>
          <h1 className="font-serif text-5xl font-medium leading-[1.05] md:text-7xl">{s.heading}</h1>
          {s.subheading && <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85 md:text-base">{s.subheading}</p>}
          {s.ctaText && s.ctaLink && <Button asChild variant="gold" className="mt-8"><Link href={s.ctaLink}>{s.ctaText}</Link></Button>}
        </motion.div>
      </div>
      {n > 1 && (
        <>
          <div className="absolute bottom-8 right-5 flex items-center gap-3 md:right-10">
            <button onClick={() => go(-1)} aria-label="Previous slide" className="flex h-10 w-10 items-center justify-center border border-white/40 text-white hover:border-gold hover:text-gold"><ChevronLeft /></button>
            <button onClick={() => go(1)} aria-label="Next slide" className="flex h-10 w-10 items-center justify-center border border-white/40 text-white hover:border-gold hover:text-gold"><ChevronRight /></button>
          </div>
          <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2 md:left-10 md:translate-x-0">
            {slides.map((sl, idx) => (
              <button key={sl.id} onClick={() => setI(idx)} aria-label={`Go to slide ${idx + 1}`} aria-current={idx === i}
                className={`h-px transition-all ${idx === i ? "w-12 bg-gold" : "w-6 bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
