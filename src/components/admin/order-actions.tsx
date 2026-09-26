"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { OrderStatus } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, Textarea, Input } from "@/components/ui/input";
import { STATUS_LABEL } from "@/lib/constants";
import { addOrderNote, deleteOrder, deleteOrderNote, updateOrderStatus } from "@/actions/orders";
import { formatDate } from "@/lib/utils";

export function StatusChanger({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [value, setValue] = useState<OrderStatus>(status);
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); start(async () => {
      const r = await updateOrderStatus(orderId, value, note);
      if (r.error) toast.error(r.error); else { toast.success(`Status → ${STATUS_LABEL[value]}`); setNote(""); }
    }); }}>
      <Select value={value} onChange={(e) => setValue(e.target.value as OrderStatus)} aria-label="Order status">
        {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </Select>
      <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Public timeline note (optional, e.g. courier tracking)" />
      <Button type="submit" disabled={pending || value === status} className="w-full">{pending ? "Saving…" : "Update status"}</Button>
      {value === "CANCELLED" && status !== "CANCELLED" && <p className="text-xs text-warm-dark">Cancelling returns items to stock.</p>}
    </form>
  );
}

export function NotesPanel({ orderId, notes }: { orderId: string; notes: { id: string; body: string; author: string; createdAt: Date }[] }) {
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();
  return (
    <div className="space-y-4">
      <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); start(async () => { const r = await addOrderNote(orderId, body); if (r.error) toast.error(r.error); else setBody(""); }); }}>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Internal note — never shown to the customer" aria-label="Internal note" />
        <Button type="submit" size="sm" disabled={pending || !body.trim()}>Add note</Button>
      </form>
      <ul className="space-y-3">
        {notes.map((n) => (
          <li key={n.id} className="rounded bg-ivory p-3 text-sm">
            <p className="whitespace-pre-line">{n.body}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-warm-dark">
              <span>{n.author} · {formatDate(n.createdAt, true)}</span>
              <button onClick={() => start(() => deleteOrderNote(n.id, orderId))} aria-label="Delete note" className="hover:text-rose-700"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button variant="destructive" size="sm" disabled={pending} onClick={() => {
      if (!confirm("Delete this order permanently? Stock will be restored if not already cancelled.")) return;
      start(async () => { const r = await deleteOrder(orderId); if (r?.error) toast.error(r.error); });
    }}><Trash2 />Delete</Button>
  );
}
