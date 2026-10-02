"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Stars } from "@/components/brand/stars";
import { formatDate } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(60),
  rating: z.number().int().min(1, "Choose a rating").max(5),
  comment: z.string().trim().min(5, "Write a few words").max(1000),
});
type Values = z.infer<typeof schema>;

type Review = { id: string; name: string; rating: number; comment: string; createdAt: Date | string };

export function Reviews({ productId, reviews, avg, count }: { productId: string; reviews: Review[]; avg: number; count: number }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { rating: 0, name: "", comment: "" } });
  const rating = watch("rating");
  const onSubmit = async (v: Values) => {
    const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, productId }) });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Could not submit review");
    toast.success("Thank you! Your review will appear once approved.");
    reset(); setOpen(false);
  };
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative z-10 clear-both scroll-mt-28 border-t border-border bg-white py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Reviews</p>
          <h2 id="reviews-title" className="mt-2 font-serif text-4xl">What clients say</h2>
          <div className="mt-3 flex items-center gap-3">
            <Stars value={avg} size={16} />
            <span className="text-sm text-warm-dark">{count ? `${avg.toFixed(1)} out of 5 · ${count} review${count > 1 ? "s" : ""}` : "No reviews yet"}</span>
          </div>
        </div>
        <Button variant="outline" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{open ? "Cancel" : "Write a review"}</Button>
      </div>
      {open && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid max-w-2xl gap-5 bg-ivory p-6" noValidate>
          <fieldset>
            <legend className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-warm-dark">Your rating</legend>
            <div className="flex gap-1" role="radiogroup">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setValue("rating", n, { shouldValidate: true })}>
                  <Star className={n <= rating ? "h-6 w-6 fill-gold text-gold" : "h-6 w-6 text-warm"} />
                </button>
              ))}
            </div>
            {errors.rating && <p className="mt-1 text-xs text-rose-700">{errors.rating.message}</p>}
          </fieldset>
          <Field label="Name" htmlFor="rv-name" error={errors.name?.message}><Input id="rv-name" {...register("name")} aria-invalid={!!errors.name} /></Field>
          <Field label="Review" htmlFor="rv-comment" error={errors.comment?.message}><Textarea id="rv-comment" rows={4} {...register("comment")} aria-invalid={!!errors.comment} /></Field>
          <Button type="submit" disabled={isSubmitting} className="w-fit">{isSubmitting ? "Submitting…" : "Submit review"}</Button>
        </form>
      )}
      {reviews.length > 0 && (
        <ul className="mt-10 grid gap-8 md:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.id} className="border-t border-gold/30 pt-6">
              <Stars value={r.rating} />
              <p className="mt-3 leading-relaxed">{r.comment}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-warm-dark">{r.name} · {formatDate(r.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}