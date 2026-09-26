"use client";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function NewsletterForm({ dark }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not subscribe");
      toast.success("Welcome to the Zod's circle.");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not subscribe");
    } finally { setLoading(false); }
  }
  const id = dark ? "newsletter-footer" : "newsletter-home";
  return (
    <form onSubmit={submit} className={cn("flex border-b", dark ? "border-white/40" : "border-obsidian")}>
      <label htmlFor={id} className="sr-only">Email address</label>
      <input id={id} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address"
        className={cn("h-12 flex-1 bg-transparent text-sm outline-none", dark ? "text-white placeholder:text-white/50" : "placeholder:text-warm")} />
      <button type="submit" disabled={loading} className={cn("px-2 text-[11px] font-medium uppercase tracking-[0.2em] disabled:opacity-50", dark ? "text-gold" : "text-obsidian hover:text-gold-dark")}>
        {loading ? "…" : "Subscribe"}
      </button>
    </form>
  );
}
