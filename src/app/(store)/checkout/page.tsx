import type { Metadata } from "next";
import { PageHeader } from "@/components/brand/section-heading";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader eyebrow="Secure Checkout" title="Checkout" />
      <CheckoutForm />
    </>
  );
}
