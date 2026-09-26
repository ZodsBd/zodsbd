import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({ page, pages, basePath, params }: { page: number; pages: number; basePath: string; params: Record<string, string | string[] | undefined> }) {
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (k !== "page" && typeof v === "string" && v) sp.set(k, v); });
    if (p > 1) sp.set("page", String(p));
    const q = sp.toString();
    return `${basePath}${q ? `?${q}` : ""}`;
  };
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  return (
    <nav aria-label="Pagination" className="mt-16 flex justify-center">
      <ul className="flex items-center gap-1">
        {page > 1 && <li><Link href={href(page - 1)} className="px-3 py-2 text-xs uppercase tracking-[0.16em]" rel="prev">Prev</Link></li>}
        {nums.map((n, i) => (
          <li key={n} className="flex items-center">
            {i > 0 && n - nums[i - 1] > 1 && <span className="px-2 text-warm">…</span>}
            <Link href={href(n)} aria-current={n === page ? "page" : undefined}
              className={cn("flex h-10 w-10 items-center justify-center text-sm", n === page ? "bg-obsidian text-white" : "hover:bg-ivory")}>{n}</Link>
          </li>
        ))}
        {page < pages && <li><Link href={href(page + 1)} className="px-3 py-2 text-xs uppercase tracking-[0.16em]" rel="next">Next</Link></li>}
      </ul>
    </nav>
  );
}
