import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.16em] text-warm-dark">
      <JsonLd data={breadcrumbLd(all)} />
      <ol className="flex flex-wrap items-center gap-2">
        {all.map((it, i) => (
          <li key={it.path} className="flex items-center gap-2">
            {i < all.length - 1 ? <Link href={it.path} className="hover:text-obsidian">{it.name}</Link> : <span aria-current="page" className="text-obsidian">{it.name}</span>}
            {i < all.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
