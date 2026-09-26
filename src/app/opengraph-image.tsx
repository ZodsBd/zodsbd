import { ogCard, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Zod's Bd — Luxury Accessories in Bangladesh";

export default function OG() {
  return ogCard({ eyebrow: "Luxury Lifestyle Accessories", title: "Crafted to be carried for years.", subtitle: "Cash on Delivery · Nationwide Bangladesh", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=560&h=630&q=70" });
}
