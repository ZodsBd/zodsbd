"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, PackageSearch, ShoppingBag } from "lucide-react";
import { cartCount, useCart } from "@/store/cart";
import { useHydrated } from "@/store/use-hydrated";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const count = hydrated ? cartCount(items) : 0;
  const item = "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] uppercase tracking-[0.12em]";
  const links = [
    { href: "/", label: "Home", Icon: Home },
    { href: "/shop", label: "Shop", Icon: LayoutGrid },
    { href: "/wishlist", label: "Wishlist", Icon: Heart },
    { href: "/track", label: "Track", Icon: PackageSearch },
  ];
  return (
    <nav aria-label="Mobile bottom" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="flex">
        {links.map(({ href, label, Icon }) => (
          <li key={href} className="flex flex-1">
            <Link href={href} className={cn(item, pathname === href ? "text-gold-dark" : "text-obsidian")}><Icon className="h-5 w-5" />{label}</Link>
          </li>
        ))}
        <li className="flex flex-1">
          <button onClick={openCart} className={cn(item, "relative")} aria-label={`Cart, ${count} items`}>
            <ShoppingBag className="h-5 w-5" />Cart
            {count > 0 && <span className="absolute right-[26%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-semibold">{count}</span>}
          </button>
        </li>
      </ul>
    </nav>
  );
}
