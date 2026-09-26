import Link from "next/link";
import type { ReviewStatus } from "@prisma/client";
import { Check, Trash2, X } from "lucide-react";
import { AdminPage, Table, Td } from "@/components/admin/ui";
import { ActionButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/brand/stars";
import { prisma } from "@/lib/prisma";
import { moderateReview } from "@/actions/content";
import { cn, formatDate } from "@/lib/utils";

export const metadata = { title: "Reviews" };
const TABS: (ReviewStatus | "ALL")[] = ["PENDING", "APPROVED", "REJECTED", "ALL"];
const STYLE: Record<ReviewStatus, string> = { PENDING: "border-amber-200 bg-amber-50 text-amber-800", APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-800", REJECTED: "border-rose-200 bg-rose-50 text-rose-800" };

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "PENDING" } = await searchParams;
  const where = status === "ALL" ? {} : { status: status as ReviewStatus };
  const reviews = await prisma.review.findMany({ where, orderBy: { createdAt: "desc" }, take: 200, include: { product: { select: { name: true, slug: true } } } });
  return (
    <AdminPage title="Reviews" description="Only approved reviews appear on the storefront.">
      <nav className="mb-4 flex gap-2">
        {TABS.map((t) => <Link key={t} href={`/admin/reviews?status=${t}`} className={cn("rounded border px-3 py-1.5 text-xs uppercase tracking-wider", status === t ? "border-obsidian bg-obsidian text-white" : "border-border bg-white")}>{t.toLowerCase()}</Link>)}
      </nav>
      <Table head={["Product", "Reviewer", "Rating", "Comment", "Date", "Status", ""]} empty={!reviews.length}>
        {reviews.map((r) => (
          <tr key={r.id} className="align-top">
            <Td><Link href={`/product/${r.product.slug}`} target="_blank" className="hover:underline">{r.product.name}</Link></Td>
            <Td>{r.name}</Td>
            <Td><Stars value={r.rating} size={12} /></Td>
            <Td className="max-w-sm whitespace-pre-line text-sm">{r.comment}</Td>
            <Td className="whitespace-nowrap text-xs text-warm-dark">{formatDate(r.createdAt)}</Td>
            <Td><Badge className={STYLE[r.status]}>{r.status}</Badge></Td>
            <Td className="whitespace-nowrap">
              {r.status !== "APPROVED" && <ActionButton size="sm" variant="ghost" action={moderateReview.bind(null, r.id, "APPROVED")} success="Approved" aria-label="Approve"><Check className="text-emerald-700" /></ActionButton>}
              {r.status !== "REJECTED" && <ActionButton size="sm" variant="ghost" action={moderateReview.bind(null, r.id, "REJECTED")} success="Rejected" aria-label="Reject"><X className="text-amber-700" /></ActionButton>}
              <ActionButton size="sm" variant="ghost" action={moderateReview.bind(null, r.id, "DELETE")} confirmText="Delete review?" success="Deleted" aria-label="Delete"><Trash2 /></ActionButton>
            </Td>
          </tr>
        ))}
      </Table>
    </AdminPage>
  );
}
