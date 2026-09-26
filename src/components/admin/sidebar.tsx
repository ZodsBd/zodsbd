"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, FileText, Image as ImageIcon, LayoutGrid, LogOut, Mail, Menu, MessageSquare, Package, Settings, ShoppingCart, Tag, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/categories", label: "Categories", Icon: LayoutGrid },
  { href: "/admin/customers", label: "Customers", Icon: Users },
  { href: "/admin/banners", label: "Banners", Icon: ImageIcon },
  { href: "/admin/coupons", label: "Coupons", Icon: Tag },
  { href: "/admin/reviews", label: "Reviews", Icon: MessageSquare },
  { href: "/admin/messages", label: "Messages", Icon: Mail },
  { href: "/admin/journal", label: "Journal", Icon: FileText },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export function AdminSidebar({ name, counts }: { name: string; counts: { pendingOrders: number; pendingReviews: number; unread: number } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const badge: Record<string, number> = { "/admin/orders": counts.pendingOrders, "/admin/reviews": counts.pendingReviews, "/admin/messages": counts.unread };
  const nav = (
    <nav className="flex h-full flex-col">
      <Link href="/admin" className="flex items-baseline gap-1.5 px-6 py-6 font-serif">
        <span className="text-xl font-semibold tracking-[0.3em] text-white">ZOD&apos;S</span><span className="text-xs font-semibold tracking-[0.3em] text-gold">BD</span>
      </Link>
      <ul className="flex-1 space-y-0.5 px-3">
        {NAV.map(({ href, label, Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded px-3 py-2.5 text-sm", active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white")}>
                <Icon className="h-4 w-4" />{label}
                {badge[href] ? <span className="ml-auto rounded-full bg-gold px-2 text-[10px] font-semibold text-obsidian">{badge[href]}</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-white/10 p-4 text-xs text-white/60">
        <p className="mb-3 truncate">Signed in as {name}</p>
        <div className="flex gap-2">
          <Link href="/" target="_blank" className="flex-1 rounded border border-white/20 px-3 py-2 text-center hover:border-gold">View store</Link>
          <form action="/api/auth/logout" method="post"><button className="flex items-center gap-1.5 rounded border border-white/20 px-3 py-2 hover:border-gold"><LogOut className="h-3.5 w-3.5" />Logout</button></form>
        </div>
      </div>
    </nav>
  );
  return (
    <>
      <div className="no-print sticky top-0 z-30 flex items-center justify-between bg-obsidian px-4 py-3 lg:hidden">
        <span className="font-serif tracking-[0.3em] text-white">ZOD&apos;S <span className="text-gold">BD</span></span>
        <button onClick={() => setOpen(true)} aria-label="Open admin menu" className="text-white"><Menu /></button>
      </div>
      <aside className="no-print fixed inset-y-0 left-0 hidden w-60 bg-obsidian lg:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-obsidian">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-5 text-white"><X /></button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
