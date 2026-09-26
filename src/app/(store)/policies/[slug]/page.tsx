import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/brand/section-heading";
import { POLICIES } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = POLICIES[(await params).slug];
  return p ? { title: p.title, alternates: { canonical: `/policies/${(await params).slug}` } } : {};
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = POLICIES[(await params).slug];
  if (!p) notFound();
  return (
    <>
      <PageHeader eyebrow="Policies" title={p.title} />
      <div className="container max-w-2xl py-14"><div className="prose-luxe" dangerouslySetInnerHTML={{ __html: p.body }} /></div>
    </>
  );
}
