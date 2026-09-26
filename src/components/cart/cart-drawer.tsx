"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cartSubtotal, useCart } from "@/store/cart";
import { useHydrated } from "@/store/use-hydrated";
import { formatBDT } from "@/lib/money";
import { useStore } from "@/components/store-provider";
import { CartLine } from "./cart-line";

export function CartDrawer() {
  const hydrated = useHydrated();
  const { isOpen, close, items } = useCart();
  const pathname = usePathname();
  const { rates } = useStore();
  useEffect(() => { close(); }, [pathname, close]);
  const list = hydrated ? items : [];
  return (
    <Dialog open={isOpen} onOpenChange={(o) => (o ? undefined : close())}>
      <DialogContent title="Your Bag" side="right">
        {list.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <ShoppingBag className="h-10 w-10 text-warm" />
            <p className="font-serif text-2xl">Your bag is empty</p>
            <Button asChild onClick={close}><Link href="/shop">Continue shopping</Link></Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {list.map((i) => <CartLine key={i.variantId} item={i} onNavigate={close} />)}
            </ul>
            <div className="space-y-3 border-t border-border p-6">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-medium">{formatBDT(cartSubtotal(list))}</span></div>
              <p className="text-xs text-warm-dark">Shipping from {formatBDT(Math.min(...Object.values(rates)))} · coupons applied at checkout.</p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button asChild variant="outline"><Link href="/cart">View Bag</Link></Button>
                <Button asChild><Link href="/checkout">Checkout</Link></Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
