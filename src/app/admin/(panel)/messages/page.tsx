import { Mail, MailOpen, Trash2 } from "lucide-react";
import { AdminPage } from "@/components/admin/ui";
import { ActionButton } from "@/components/admin/confirm-button";
import { prisma } from "@/lib/prisma";
import { deleteMessage, setMessageRead } from "@/actions/content";
import { cn, formatDate } from "@/lib/utils";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <AdminPage title="Contact messages" description={`${messages.filter((m) => !m.isRead).length} unread`}>
      <ul className="space-y-3">
        {messages.map((m) => (
          <li key={m.id} className={cn("rounded border bg-white p-5", m.isRead ? "border-border" : "border-gold")}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{m.subject || "(no subject)"} {!m.isRead && <span className="ml-2 rounded bg-gold px-1.5 py-0.5 text-[10px] font-semibold uppercase">New</span>}</p>
                <p className="text-xs text-warm-dark">{m.name} · {[m.phone, m.email].filter(Boolean).join(" · ")} · {formatDate(m.createdAt, true)}</p>
              </div>
              <div className="flex gap-1">
                {m.email && <a className="rounded border border-border px-3 py-1.5 text-xs hover:bg-ivory" href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject ?? "Your message")}`}>Reply</a>}
                <ActionButton size="sm" variant="ghost" action={setMessageRead.bind(null, m.id, !m.isRead)} aria-label={m.isRead ? "Mark unread" : "Mark read"}>{m.isRead ? <Mail /> : <MailOpen />}</ActionButton>
                <ActionButton size="sm" variant="ghost" action={deleteMessage.bind(null, m.id)} confirmText="Delete message?" success="Deleted" aria-label="Delete"><Trash2 /></ActionButton>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm">{m.message}</p>
          </li>
        ))}
        {!messages.length && <li className="rounded border border-border bg-white p-10 text-center text-sm text-warm-dark">Inbox is empty.</li>}
      </ul>
    </AdminPage>
  );
}
