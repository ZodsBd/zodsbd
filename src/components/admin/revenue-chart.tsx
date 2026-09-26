"use client";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatBDT } from "@/lib/money";
import { cn } from "@/lib/utils";

type Point = { date: string; label: string; revenue: number; orders: number };

export function RevenueChart({ s7, s30, r7, r30 }: { s7: Point[]; s30: Point[]; r7: number; r30: number }) {
  const [range, setRange] = useState<7 | 30>(7);
  const data = range === 7 ? s7 : s30;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-warm-dark">Revenue · last {range} days</p>
          <p className="font-serif text-3xl">{formatBDT(range === 7 ? r7 : r30)}</p>
        </div>
        <div className="flex rounded border border-border text-xs">
          {([7, 30] as const).map((r) => (
            <button key={r} onClick={() => setRange(r)} className={cn("px-3 py-1.5", range === r ? "bg-obsidian text-white" : "hover:bg-ivory")}>{r} days</button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0, right: 0, top: 8 }}>
            <CartesianGrid vertical={false} stroke="#EFE9DF" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#5E584F" }} tickLine={false} axisLine={false} interval={range === 30 ? 4 : 0} />
            <YAxis tick={{ fontSize: 11, fill: "#5E584F" }} tickLine={false} axisLine={false} width={60} tickFormatter={(v: number) => `৳${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`} />
            <Tooltip cursor={{ fill: "#F7F4EF" }} formatter={(v) => [formatBDT(Number(v)), "Revenue"]} />
            <Bar dataKey="revenue" fill="#C9A227" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
