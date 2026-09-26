"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function SearchForm({ autoFocus, defaultValue = "" }: { autoFocus?: boolean; defaultValue?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);
  return (
    <form
      role="search"
      onSubmit={(e) => { e.preventDefault(); router.push(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop"); }}
      className="flex items-center border-b border-obsidian"
    >
      <label htmlFor="site-search" className="sr-only">Search products</label>
      <input id="site-search" autoFocus={autoFocus} value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Search belts, perfumes, clutches…" className="h-12 flex-1 bg-transparent text-base outline-none placeholder:text-warm" />
      <button type="submit" aria-label="Submit search" className="p-2"><Search className="h-5 w-5" /></button>
    </form>
  );
}
