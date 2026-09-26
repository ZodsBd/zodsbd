"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchForm } from "./search-form";
import { cartCount, useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useHydrated } from "@/store/use-hydrated";
import { cn } from "@/lib/utils";

export type NavCategory = { name: string; slug: string };

export function Header({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const wishCount = useWishlist((s) => s.items.length);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);

  const count = hydrated ? cartCount(items) : 0;
  const links = [{ href: "/shop", label: "Shop All" }, ...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })), { href: "/journal", label: "Journal" }];

  return (
    <header className={cn("sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow", scrolled && "shadow-[0_1px_0_0_#E6E0D6]")}>
      <div className="bg-obsidian py-2 text-center text-[10px] uppercase tracking-[0.25em] text-white/85">
        Cash on Delivery · Nationwide Shipping · 7-Day Exchange
      </div>
      <div className="container flex h-16 items-center justify-between md:h-20">
        <div className="flex flex-1 items-center gap-2 lg:hidden">
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="p-2 -ml-2"><Menu className="h-5 w-5" /></button>
          <button onClick={() => setSearchOpen(true)} aria-label="Search" className="p-2"><Search className="h-5 w-5" /></button>
        </div>
        <nav aria-label="Primary" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-6">
            {links.slice(0, 4).map((l) => (
              <li key={l.href}><NavLink href={l.href} active={pathname === l.href}>{l.label}</NavLink></li>
            ))}
          </ul>
        </nav>
        <Wordmark />
        <div className="flex flex-1 items-center justify-end gap-1 md:gap-3">
          <nav aria-label="Secondary" className="mr-4 hidden lg:block">
            <ul className="flex items-center gap-6">
              {links.slice(4).map((l) => (
                <li key={l.href}><NavLink href={l.href} active={pathname === l.href}>{l.label}</NavLink></li>
              ))}
            </ul>
          </nav>
          <button onClick={() => setSearchOpen(true)} aria-label="Search" className="hidden p-2 hover:text-gold lg:block"><Search className="h-5 w-5" /></button>
          <Link href="/wishlist" aria-label="Wishlist" className="relative hidden p-2 hover:text-gold sm:block">
            <Heart className="h-5 w-5" />
            {hydrated && wishCount > 0 && <CountDot n={wishCount} />}
          </Link>
          <button onClick={openCart} aria-label={`Open cart, ${count} items`} className="relative p-2 hover:text-gold">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <CountDot n={count} />}
          </button>
        </div>
      </div>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent title="Menu" side="left">
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="divide-y divide-border">
              {links.map((l) => (
                <li key={l.href}><Link href={l.href} className="block py-4 font-serif text-2xl">{l.label}</Link></li>
              ))}
            </ul>
            <ul className="mt-8 space-y-3 text-xs uppercase tracking-[0.18em] text-warm-dark">
              <li><Link href="/track">Track My Order</Link></li>
              <li><Link href="/wishlist">Wishlist</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </nav>
        </DialogContent>
      </Dialog>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent title="Search the collection">
          <div className="p-6"><SearchForm autoFocus /></div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={cn("text-[11px] font-medium uppercase tracking-[0.2em] transition-colors hover:text-gold-dark", active && "text-gold-dark")}>
      {children}
    </Link>
  );
}

function CountDot({ n }: { n: number }) {
  return <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-semibold text-obsidian">{n}</span>;
}

