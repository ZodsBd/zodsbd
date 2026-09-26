import Link from "next/link";
import { AdminPage, PageLinks, Table, Td } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatBDT } from "@/lib/money";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Customers" };
const PER = 30;

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const where = sp.q ? { OR: [{ phone: { contains: sp.q } }, { name: { contains: sp.q, mode: "insensitive" as const } }, { district: { contains: sp.q, mode: "insensitive" as const } }] } : {};
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({ where, skip: (page - 1) * PER, take: PER, orderBy: { updatedAt: "desc" } }),
    prisma.customer.count({ where }),
  ]);
  const stats = await prisma.order.groupBy({
    by: ["customerId"],
    where: { customerId: { in: customers.map((c) => c.id) } },
    _count: true,
    _max: { createdAt: true },
  });
  const spent = await prisma.order.groupBy({
    by: ["customerId"],
    where: { customerId: { in: customers.map((c) => c.id) }, status: { not: "CANCELLED" } },
    _sum: { total: true },
  });
  const s = (id: string) => stats.find((x) => x.customerId === id);
  const t = (id: string) => spent.find((x) => x.customerId === id)?._sum.total ?? 0;
  return (
    <AdminPage title="Customers" description={`${total} customers, grouped by phone number`}>
      <form className="mb-4 flex gap-2 rounded border border-border bg-white p-4">
        <Input name="q" defaultValue={sp.q} placeholder="Search phone, name or district" aria-label="Search customers" />
        <Button type="submit" className="h-11">Search</Button>
      </form>
      <Table head={["Name", "Phone", "District", "Orders", "Total spent", "Last order"]} empty={!customers.length}>
        {customers.map((c) => (
          <tr key={c.id}>
            <Td className="font-medium">{c.name}{c.email && <p className="text-xs font-normal text-warm-dark">{c.email}</p>}</Td>
            <Td><Link href={`/admin/orders?q=${c.phone}`} className="hover:underline">{c.phone}</Link></Td>
            <Td>{c.district ?? "—"}</Td>
            <Td>{s(c.id)?._count ?? 0}</Td>
            <Td className="font-medium">{formatBDT(t(c.id))}</Td>
            <Td className="text-xs text-warm-dark">{s(c.id)?._max.createdAt ? formatDate(s(c.id)!._max.createdAt!) : "—"}</Td>
          </tr>
        ))}
      </Table>
      <PageLinks page={page} pages={Math.ceil(total / PER)} href={(p) => `/admin/customers?${new URLSearchParams({ ...(sp.q ? { q: sp.q } : {}), page: String(p) })}`} />
    </AdminPage>
  );
}
