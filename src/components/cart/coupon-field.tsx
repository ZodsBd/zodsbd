"use client";
import { useState } from "react";
import { Tag, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CouponField({ error }: { error?: string | null }) {
  const couponCode = useCart((s) => s.couponCode);
  const setCoupon = useCart((s) => s.setCoupon);
  const [code, setCode] = useState("");
  if (couponCode) {
    return (
      <div>
        <div className="flex items-center justify-between border border-dashed border-gold bg-ivory px-3 py-2 text-sm">
          <span className="flex items-center gap-2"><Tag className="h-4 w-4 text-gold-dark" />{couponCode}</span>
          <button onClick={() => setCoupon(null)} aria-label="Remove coupon"><X className="h-4 w-4" /></button>
        </div>
        {error && <p role="alert" className="mt-1 text-xs text-rose-700">{error}</p>}
      </div>
    );
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (code.trim()) setCoupon(code.trim().toUpperCase()); setCode(""); }} className="flex gap-2">
      <label htmlFor="coupon" className="sr-only">Coupon code</label>
      <Input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" className="uppercase" />
      <Button type="submit" variant="outline" className="h-11 px-5">Apply</Button>
    </form>
  );
}
