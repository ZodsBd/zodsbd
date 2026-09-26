import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/brand/reveal";

type Cat = { id: string; name: string; slug: string; image: string | null };

export function CategoryGrid({ categories }: { categories: Cat[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
      {categories.map((c, idx) => (
        <li key={c.id} className={idx < 2 ? "md:col-span-3" : idx === 4 ? "col-span-2 md:col-span-2" : "md:col-span-2"}>
          <Reveal delay={idx * 0.06}>
            <Link href={`/category/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-ivory md:aspect-[4/3]">
              {c.image && <Image src={c.image} alt={c.name} fill sizes="(min-width:768px) 40vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
                <h3 className="font-serif text-2xl md:text-3xl">{c.name}</h3>
                <span className="mt-2 inline-block border-b border-gold pb-0.5 text-[10px] uppercase tracking-[0.25em]">Discover</span>
              </div>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
