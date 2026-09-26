"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { CouponField } from "@/components/cart/coupon-field";
import { SummaryRows } from "@/components/cart/order-summary";
import { ZoneRadio } from "@/components/cart/zone-radio";
import { useQuote } from "@/components/cart/use-quote";
import { checkoutSchema, type CheckoutInput } from "@/lib/validators";
import { DISTRICTS } from "@/lib/districts";
import { suggestZone, zoneLabel } from "@/lib/shipping";
import { formatBDT } from "@/lib/money";
import { cartSubtotal, useCart } from "@/store/cart";
import { useHydrated } from "@/store/use-hydrated";

export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.couponCode);
  const clear = useCart((s) => s.clear);
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fullName: "", phone: "", email: "", address: "", district: undefined, thana: "", zone: "INSIDE_DHAKA", notes: "" },
  });
  const zone = watch("zone");
  const district = watch("district");
  useEffect(() => { if (district) setValue("zone", suggestZone(district)); }, [district, setValue]);
  const { quote, loading } = useQuote(zone);

  useEffect(() => { if (hydrated && !items.length && !done) router.replace("/cart"); }, [hydrated, items.length, done, router]);

  const onSubmit = async (values: CheckoutInput) => {
    if (quote?.issues.length) return toast.error(quote.issues[0]);
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })), couponCode: couponCode ?? undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place order");
      setDone(true);
      clear();
      router.push(`/order/${data.orderNumber}?phone=${encodeURIComponent(values.phone)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not place order");
      setPlacing(false);
    }
  };

  if (!hydrated || !items.length) return <div className="container min-h-[60vh] py-20" />;
  const subtotal = quote?.subtotal ?? cartSubtotal(items);
  const discount = quote?.discount ?? 0;
  const shipping = quote?.shippingFee ?? null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="container grid gap-12 py-10 lg:grid-cols-[1fr_420px] lg:py-14">
      <div className="space-y-10">
        <section aria-labelledby="contact-h" className="space-y-5">
          <h2 id="contact-h" className="font-serif text-3xl">Contact</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name *" htmlFor="fullName" error={errors.fullName?.message}><Input id="fullName" autoComplete="name" {...register("fullName")} aria-invalid={!!errors.fullName} /></Field>
            <Field label="Mobile number *" htmlFor="phone" error={errors.phone?.message}><Input id="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX" {...register("phone")} aria-invalid={!!errors.phone} /></Field>
            <Field label="Email (optional)" htmlFor="email" error={errors.email?.message} className="sm:col-span-2"><Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} /></Field>
          </div>
        </section>
        <section aria-labelledby="ship-h" className="space-y-5">
          <h2 id="ship-h" className="font-serif text-3xl">Delivery address</h2>
          <Field label="Full address *" htmlFor="address" error={errors.address?.message}>
            <Textarea id="address" rows={3} autoComplete="street-address" placeholder="House, road, area (বাংলাতেও লিখতে পারেন)" {...register("address")} aria-invalid={!!errors.address} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="District *" htmlFor="district" error={errors.district?.message}>
              <Select id="district" defaultValue="" {...register("district")} aria-invalid={!!errors.district}>
                <option value="" disabled>Select district</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
            <Field label="Thana / Upazila *" htmlFor="thana" error={errors.thana?.message}><Input id="thana" {...register("thana")} aria-invalid={!!errors.thana} /></Field>
          </div>
          <ZoneRadio value={zone} onChange={(z) => setValue("zone", z, { shouldValidate: true })} />
          <Field label="Order notes (optional)" htmlFor="notes" error={errors.notes?.message}><Textarea id="notes" rows={2} placeholder="Landmark, preferred delivery time, gift note…" {...register("notes")} /></Field>
        </section>
        <section aria-labelledby="pay-h" className="space-y-3">
          <h2 id="pay-h" className="font-serif text-3xl">Payment</h2>
          <label className="flex items-center gap-3 border border-obsidian bg-ivory px-4 py-4 text-sm">
            <input type="radio" checked readOnly className="accent-obsidian" />
            <span><span className="font-medium">Cash on Delivery</span><span className="block text-xs text-warm-dark">Pay in cash to the courier when your order arrives.</span></span>
          </label>
        </section>
      </div>

      <aside className="h-fit space-y-6 bg-ivory p-6 md:p-8 lg:sticky lg:top-28">
        <h2 className="font-serif text-2xl">Your order</h2>
        <ul className="space-y-4">
          {items.map((i) => (
            <li key={i.variantId} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 bg-white">
                {i.image && <Image src={i.image} alt="" fill sizes="56px" className="object-cover" />}
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-obsidian text-[10px] text-white">{i.quantity}</span>
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-medium">{i.name}</p>
                {i.variantLabel && <p className="text-xs text-warm-dark">{i.variantLabel}</p>}
              </div>
              <span className="text-sm">{formatBDT(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <CouponField error={quote?.couponError} />
        <SummaryRows subtotal={subtotal} discount={discount} shippingFee={shipping} total={subtotal - discount + (shipping ?? 0)} couponCode={quote?.couponCode} shippingLabel={zoneLabel(zone)} />
        {quote?.issues.length ? <p role="alert" className="text-xs text-rose-700">{quote.issues[0]} <Link href="/cart" className="underline">Edit bag</Link></p> : null}
        <Button type="submit" className="w-full" size="lg" disabled={placing || loading || !!quote?.issues.length}>
          <Lock /> {placing ? "Placing order…" : "Place order · Cash on Delivery"}
        </Button>
        <p className="text-center text-xs text-warm-dark">By placing your order you agree to our <Link href="/policies/terms" className="underline">Terms</Link>.</p>
      </aside>
    </form>
  );
}
