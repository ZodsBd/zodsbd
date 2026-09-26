import type { OrderStatus } from "@prisma/client";

export const BRAND = {
  name: "Zod's Bd",
  tagline: "Luxury lifestyle accessories, crafted for Bangladesh",
  description:
    "Zod's Bd curates premium backpacks, leather belts, cigarette cases, perfumes and clutch bags. Cash on delivery nationwide across Bangladesh.",
};

export const ORDER_FLOW: OrderStatus[] = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  CONFIRMED: "bg-sky-50 text-sky-800 border-sky-200",
  PACKED: "bg-indigo-50 text-indigo-800 border-indigo-200",
  SHIPPED: "bg-violet-50 text-violet-800 border-violet-200",
  DELIVERED: "bg-emerald-50 text-emerald-800 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-800 border-rose-200",
};

export const PAGE_SIZE = 12;
