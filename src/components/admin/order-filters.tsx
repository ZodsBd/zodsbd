"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { STATUS_LABEL } from "@/lib/constants";

export function OrderFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = new URLSearchParams();
    ["q", "status", "from", "to"].forEach((k) => { const v = String(fd.get(k) ?? "").trim(); if (v) next.set(k, v); });
    router.push(`${pathname}?${next}`);
  };
  const exportQs = new URLSearchParams(sp.toString());
  exportQs.delete("page");
  return (
    <form onSubmit={submit} className="mb-4 grid gap-3 rounded border border-border bg-white p-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto_auto]">
      <Input name="q" defaultValue={sp.get("q") ?? ""} placeholder="Order no, phone or name" aria-label="Search orders" />
      <Select name="status" defaultValue={sp.get("status") ?? ""} aria-label="Status">
        <option value="">All statuses</option>
        {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </Select>
      <Input type="date" name="from" defaultValue={sp.get("from") ?? ""} aria-label="From date" />
      <Input type="date" name="to" defaultValue={sp.get("to") ?? ""} aria-label="To date" />
      <Button type="submit" className="h-11">Filter</Button>
      <Button asChild variant="outline" className="h-11"><a href={`/api/admin/orders/export?${exportQs}`}><Download />CSV</a></Button>
    </form>
  );
}
