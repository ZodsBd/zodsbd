import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/cart-page";

export const metadata: Metadata = { title: "Your Bag", robots: { index: false } };

export default function CartPage() {
  return <CartPageView />;
}
