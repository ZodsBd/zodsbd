import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/brand/section-heading";
import { Reveal } from "@/components/brand/reveal";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;
export const metadata: Metadata = { title: "Journal & Lookbook", description: "Style notes, care guides and lookbooks from Zod's Bd.", alternates: { canonical: "/journal" } };

export default async function JournalPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const posts = await prisma.post.findMany({ where: { published: true, ...(tag ? { tags: { has: tag } } : {}) }, orderBy: { publishedAt: "desc" } });
  return (
    <>
      <PageHeader eyebrow="Lookbook" title="The Journal" intro="Notes on craft, care and the art of carrying well." />
      <div className="container py-14">
        {tag && <p className="mb-8 text-sm text-warm-dark">Tagged “{tag}” · <Link href="/journal" className="underline">clear</Link></p>}
        {posts.length === 0 && <p className="py-20 text-center text-warm-dark">No stories yet.</p>}
        <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <li key={p.id}>
              <Reveal delay={(i % 3) * 0.08}>
                <article className="group">
                  <Link href={`/journal/${p.slug}`}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-ivory">
                      <Image src={p.coverImage} alt={p.title} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-warm-dark">{p.publishedAt && formatDate(p.publishedAt)}</p>
                    <h2 className="mt-2 font-serif text-2xl leading-snug group-hover:text-gold-dark">{p.title}</h2>
                    {p.excerpt && <p className="mt-3 text-sm leading-relaxed text-warm-dark">{p.excerpt}</p>}
                  </Link>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
