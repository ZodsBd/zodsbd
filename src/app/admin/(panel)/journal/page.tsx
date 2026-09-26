import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPage, Table, Td } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Journal" };

export default async function JournalAdmin() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <AdminPage title="Journal / Lookbook" actions={<Button asChild size="sm"><Link href="/admin/journal/new"><Plus />New post</Link></Button>}>
      <Table head={["Title", "Tags", "Published", "Status"]} empty={!posts.length}>
        {posts.map((p) => (
          <tr key={p.id}>
            <Td><Link href={`/admin/journal/${p.id}`} className="font-medium hover:underline">{p.title}</Link></Td>
            <Td className="text-xs text-warm-dark">{p.tags.join(", ")}</Td>
            <Td className="text-xs">{p.publishedAt ? formatDate(p.publishedAt) : "—"}</Td>
            <Td><Badge className={p.published ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-border text-warm-dark"}>{p.published ? "Live" : "Draft"}</Badge></Td>
          </tr>
        ))}
      </Table>
    </AdminPage>
  );
}
