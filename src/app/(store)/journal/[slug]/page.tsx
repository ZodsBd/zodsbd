import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/prisma";
import { formatDate, siteUrl } from "@/lib/utils";

export const revalidate = 300;
const getPost = cache((slug: string) => prisma.post.findFirst({ where: { slug, published: true } }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt ?? undefined, alternates: { canonical: `/journal/${p.slug}` }, openGraph: { type: "article", title: p.title, description: p.excerpt ?? undefined, publishedTime: p.publishedAt?.toISOString() } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  const ld = {
    "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.excerpt, image: [p.coverImage],
    datePublished: p.publishedAt?.toISOString(), dateModified: p.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Zod's Bd" }, publisher: { "@type": "Organization", name: "Zod's Bd", logo: { "@type": "ImageObject", url: siteUrl("/icon.svg") } },
    mainEntityOfPage: siteUrl(`/journal/${p.slug}`), keywords: p.tags.join(", "),
  };
  return (
    <article className="pb-20">
      <JsonLd data={ld} />
      <header className="container max-w-3xl pt-10 text-center md:pt-16">
        <div className="flex justify-center"><Breadcrumbs items={[{ name: "Journal", path: "/journal" }, { name: p.title, path: `/journal/${p.slug}` }]} /></div>
        <p className="mt-10 text-[11px] uppercase tracking-[0.2em] text-warm-dark">{p.publishedAt && formatDate(p.publishedAt)}</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">{p.title}</h1>
        {p.excerpt && <p className="mx-auto mt-6 max-w-xl text-warm-dark">{p.excerpt}</p>}
        <div className="mx-auto mt-8 h-px w-16 bg-gold" />
      </header>
      <div className="container mt-12 max-w-5xl"><div className="relative aspect-[16/9] overflow-hidden bg-ivory"><Image src={p.coverImage} alt={p.title} fill priority sizes="(min-width:1024px) 1024px, 100vw" className="object-cover" /></div></div>
      <div className="container mt-14 max-w-2xl">
        <div className="prose-luxe" dangerouslySetInnerHTML={{ __html: p.body }} />
        {p.tags.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6">
            {p.tags.map((t) => <li key={t}><Link href={`/journal?tag=${encodeURIComponent(t)}`} className="border border-border px-3 py-1 text-xs hover:border-obsidian">#{t}</Link></li>)}
          </ul>
        )}
      </div>
    </article>
  );
}
