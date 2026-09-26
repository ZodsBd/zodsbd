import Link from "next/link";
import { cn } from "@/lib/utils";

export function AdminPage({ title, actions, children, description }: { title: string; actions?: React.ReactNode; children: React.ReactNode; description?: string }) {
  return (
    <div className="p-4 md:p-8">
      <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-warm-dark">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function Card({ className, children, title }: { className?: string; children: React.ReactNode; title?: string }) {
  return (
    <section className={cn("rounded border border-border bg-white p-5", className)}>
      {title && <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-warm-dark">{title}</h2>}
      {children}
    </section>
  );
}

export function Table({ head, children, empty }: { head: React.ReactNode[]; children: React.ReactNode; empty?: boolean }) {
  return (
    <div className="overflow-x-auto rounded border border-border bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-ivory/60 text-[11px] uppercase tracking-[0.12em] text-warm-dark">
          <tr>{head.map((h, i) => <th key={i} scope="col" className="px-4 py-3 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
      {empty && <p className="p-10 text-center text-sm text-warm-dark">Nothing here yet.</p>}
    </div>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
}

export function PageLinks({ page, pages, href }: { page: number; pages: number; href: (p: number) => string }) {
  if (pages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-end gap-2 text-sm">
      {page > 1 && <Link className="rounded border border-border px-3 py-1.5 hover:bg-ivory" href={href(page - 1)}>Prev</Link>}
      <span className="text-warm-dark">Page {page} of {pages}</span>
      {page < pages && <Link className="rounded border border-border px-3 py-1.5 hover:bg-ivory" href={href(page + 1)}>Next</Link>}
    </div>
  );
}

export function Toggle({ name, defaultChecked, label }: { name: string; defaultChecked?: boolean; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-obsidian" />{label}
    </label>
  );
}
