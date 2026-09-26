"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { contactSchema } from "@/lib/validators";

type Values = z.input<typeof contactSchema>;

export function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(contactSchema) });
  const onSubmit = async (v: Values) => {
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Could not send message");
    toast.success("Thank you — we'll be in touch within 24 hours.");
    reset({ name: "", email: "", phone: "", subject: "", message: "" });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label="Name *" htmlFor="c-name" error={errors.name?.message}><Input id="c-name" {...register("name")} aria-invalid={!!errors.name} /></Field>
      <Field label="Phone" htmlFor="c-phone" error={errors.phone?.message}><Input id="c-phone" type="tel" {...register("phone")} /></Field>
      <Field label="Email" htmlFor="c-email" error={errors.email?.message}><Input id="c-email" type="email" {...register("email")} aria-invalid={!!errors.email} /></Field>
      <Field label="Subject" htmlFor="c-subject" error={errors.subject?.message}><Input id="c-subject" {...register("subject")} /></Field>
      <Field label="Message *" htmlFor="c-msg" error={errors.message?.message} className="sm:col-span-2"><Textarea id="c-msg" rows={6} {...register("message")} aria-invalid={!!errors.message} /></Field>
      <Button type="submit" disabled={isSubmitting} className="w-fit">{isSubmitting ? "Sending…" : "Send message"}</Button>
    </form>
  );
}
