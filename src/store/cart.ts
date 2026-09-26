"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  variantLabel: string;
  image: string | null;
  price: number;
  compareAtPrice: number | null;
  quantity: number;
  maxStock: number;
};

type CartState = {
  items: CartItem[];
  couponCode: string | null;
  isOpen: boolean;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  setCoupon: (code: string | null) => void;
  open: () => void;
  close: () => void;
};

const clampQty = (q: number, max: number) => Math.max(1, Math.min(q, Math.max(1, max), 20));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      couponCode: null,
      isOpen: false,
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.variantId === item.variantId ? { ...i, ...item, quantity: clampQty(i.quantity + qty, item.maxStock) } : i
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: clampQty(qty, item.maxStock) }] };
        }),
      setQty: (variantId, qty) =>
        set((s) => ({ items: s.items.map((i) => (i.variantId === variantId ? { ...i, quantity: clampQty(qty, i.maxStock) } : i)) })),
      remove: (variantId) => set((s) => ({ items: s.items.filter((i) => i.variantId !== variantId) })),
      clear: () => set({ items: [], couponCode: null }),
      setCoupon: (couponCode) => set({ couponCode }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: "zods-cart", partialize: (s) => ({ items: s.items, couponCode: s.couponCode }) }
  )
);

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.quantity, 0);
export const cartSubtotal = (items: CartItem[]) => items.reduce((n, i) => n + i.price * i.quantity, 0);
