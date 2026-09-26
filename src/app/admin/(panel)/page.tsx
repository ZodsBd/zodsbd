import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { AdminPage, Card } from "@/components/admin/ui";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { Badge } from "@/components/ui/badge";
import { getDashboard } from "@/lib/queries/dashboard";
import { formatBDT } from "@/lib/money";
import { STATUS_LABEL, STATUS_STYLE } from "@/lib/constants";
import { variantLabel } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const d = await getDashboard();
  const statuses: OrderStatus[] = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];
  return (
    <AdminPage title="Dashboard" description="Dhaka time. Revenue excludes cancelled orders.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Today's orders" value={String(d.todayOrders)} />
        <Stat label="Today's revenue" value={formatBDT(d.todayRevenue)} />
        <Stat label="Pending COD value" value={formatBDT(d.pendingCodValue)} hint={`${d.pendingCodCount} open orders`} />
        <Stat label="Revenue · 30 days" value={formatBDT(d.revenue30)} />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {statuses.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className="rounded border border-border bg-white p-4 hover:border-obsidian">
            <Badge className={STATUS_STYLE[s]}>{STATUS_LABEL[s]}</Badge>
            <p className="mt-3 font-serif text-3xl">{d.statusCounts[s] ?? 0}</p>
          </Link>
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card><RevenueChart s7={d.series7} s30={d.series30} r7={d.revenue7} r30={d.revenue30} /></Card>
        <Card title="Top 5 products">
          <ol className="space-y-3 text-sm">
            {d.topProducts.map((p, i) => (
              <li key={`${p.productId}-${i}`} className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-3"><span className="font-serif text-lg text-gold-dark">{i + 1}</span>
                  {p.productId ? <Link href={`/admin/products/${p.productId}`} className="truncate hover:underline">{p.name}</Link> : <span className="truncate">{p.name}</span>}
                </span>
                <span className="shrink-0 text-right text-xs text-warm-dark">{p.qty} sold<br />{formatBDT(p.revenue)}</span>
              </li>
            ))}
            {!d.topProducts.length && <li className="text-warm-dark">No sales yet.</li>}
          </ol>
        </Card>
      </div>
      <Card className="mt-4" title="Low-stock alerts (< 5)">
        {d.lowStock.length ? (
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {d.lowStock.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-3 rounded border border-border px-3 py-2 text-sm">
                <span className="flex min-w-0 items-center gap-2"><AlertTriangle className={`h-4 w-4 shrink-0 ${v.stock === 0 ? "text-rose-700" : "text-amber-600"}`} />
                  <Link href={`/admin/products/${v.product.id}`} className="truncate hover:underline">{v.product.name} {variantLabel(v) && `· ${variantLabel(v)}`}</Link>
                </span>
                <span className={v.stock === 0 ? "font-semibold text-rose-700" : "font-semibold text-amber-700"}>{v.stock}</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-warm-dark">All variants are well stocked.</p>}
      </Card>
    </AdminPage>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded border border-border bg-white p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-warm-dark">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-warm-dark">{hint}</p>}
    </div>
  );
}
