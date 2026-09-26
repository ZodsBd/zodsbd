"use client";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { type CartItem, useCart } from "@/store/cart";
import { formatBDT } from "@/lib/money";
import { QtyPicker } from "./qty-picker";
import type { QuoteLine } from "./use-quote";

export function CartLine({ item, line, onNavigate }: { item: CartItem; line?: QuoteLine; onNavigate?: () => void }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const unavailable = line && !line.available;
  const short = line && line.available && line.stock < item.quantity;
  return (
    <li className="flex gap-4 py-5">
      <Link href={`/product/${item.slug}`} onClick={onNavigate} className="relative h-28 w-24 shrink-0 overflow-hidden bg-ivory">
        {item.image && <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/product/${item.slug}`} onClick={onNavigate} className="line-clamp-2 font-serif text-lg leading-tight hover:text-gold-dark">{item.name}</Link>
            {item.variantLabel && <p className="mt-1 text-xs text-warm-dark">{item.variantLabel}</p>}
          </div>
          <button onClick={() => remove(item.variantId)} aria-label={`Remove ${item.name}`} className="h-fit p-1 text-warm-dark hover:text-obsidian"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <QtyPicker small value={item.quantity} max={item.maxStock} onChange={(n) => setQty(item.variantId, n)} />
          <span className="text-sm font-medium">{formatBDT(item.price * item.quantity)}</span>
        </div>
        {unavailable && <p className="mt-2 text-xs text-rose-700">Sold out — please remove this item.</p>}
        {short && <p className="mt-2 text-xs text-rose-700">Only {line!.stock} left in stock.</p>}
      </div>
    </li>
  );
}
