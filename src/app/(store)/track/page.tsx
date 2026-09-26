import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/brand/section-heading";
import { TrackForm } from "@/components/order/track-form";

export const metadata: Metadata = { title: "Track My Order", description: "Track your Zod's Bd order with your order number and phone.", alternates: { canonical: "/track" } };

export default function TrackPage() {
  return (
    <>
      <PageHeader eyebrow="My Orders" title="Track My Order" intro="Enter your order number and the phone number used at checkout. You'll also see every order placed with that number." />
      <Suspense><TrackForm /></Suspense>
    </>
  );
}
