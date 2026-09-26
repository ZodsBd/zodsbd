"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { CouponType } from "@prisma/client";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ActionButton } from "./confirm-button";
import { Table, Td } from "./ui";
import { deleteCoupon, saveCoupon } from "@/actions/content";
import { formatBDT } from "@/lib/money";
import { formatDate } from "@/lib/utils";

type C = { id: string; code: string; type: CouponType; value: number; minOrderValue: number; maxDiscount: number | null; usageLimit: number | null; usedCount: number; expiresAt: Date | null; isActive: boolean };
type V = { code: string; type: CouponType; value: string; minOrderValue: string; maxDiscount: string; usageLimit: string; expiresAt: string; isActive: boolean };
const blank: V = { code: "", type: "PERCENTAGE", value: "10", minOrderValue: "0", maxDiscount: "", usageLimit: "", expiresAt: "", isActive: true };
const dateInput = (d: Date | null) => (d ? new Date(d.getTime() + 6 * 3600000).toISOString().slice(0, 10) : "");

export function CouponManager({ coupons }: { coupons: C[] }) {
  const [edit, setEdit] = useState<{ id: string | null; v: V } | null>(null);
  const [pending, start] = useTransition();
  const upd = (p: Partial<V>) => edit && setEdit({ ...edit, v: { ...edit.v, ...p } });
  const save = () => edit && start(async () => {
    const r = await saveCoupon(edit.id, { ...edit.v, expiresAt: edit.v.expiresAt || null });
    if (!r.ok) return void toast.error(r.error);
    toast.success("Coupon saved"); setEdit(null);
  });
  const now = new Date();
  return (
    <>
      <div className="mb-4 flex justify-end"><Button size="sm" onClick={() => setEdit({ id: null, v: blank })}><Plus />Add coupon</Button></div>
      <Table head={["Code", "Discount", "Min order", "Usage", "Expires", "Status", ""]} empty={!coupons.length}>
        {coupons.map((c) => {
          const expired = c.expiresAt && c.expiresAt < now;
          const exhausted = c.usageLimit !== null && c.usedCount >= c.usageLimit;
          return (
            <tr key={c.id}>
              <Td className="font-mono font-medium">{c.code}</Td>
              <Td>{c.type === "FIXED" ? formatBDT(c.value) : `${c.value}%${c.maxDiscount ? ` (max ${formatBDT(c.maxDiscount)})` : ""}`}</Td>
              <Td>{c.minOrderValue ? formatBDT(c.minOrderValue) : "—"}</Td>
              <Td>{c.usedCount}{c.usageLimit !== null ? ` / ${c.usageLimit}` : ""}</Td>
              <Td>{c.expiresAt ? formatDate(c.expiresAt) : "Never"}</Td>
              <Td><Badge className={c.isActive && !expired && !exhausted ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-border text-warm-dark"}>{!c.isActive ? "Inactive" : expired ? "Expired" : exhausted ? "Used up" : "Active"}</Badge></Td>
              <Td className="whitespace-nowrap text-right">
                <Button variant="ghost" size="sm" aria-label="Edit" onClick={() => setEdit({ id: c.id, v: { code: c.code, type: c.type, value: String(c.value), minOrderValue: String(c.minOrderValue), maxDiscount: c.maxDiscount?.toString() ?? "", usageLimit: c.usageLimit?.toString() ?? "", expiresAt: dateInput(c.expiresAt), isActive: c.isActive } })}><Pencil /></Button>
                <ActionButton variant="ghost" size="sm" action={() => deleteCoupon(c.id)} confirmText={`Delete ${c.code}?`} success="Deleted" aria-label="Delete"><Trash2 /></ActionButton>
              </Td>
            </tr>
          );
        })}
      </Table>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent title={edit?.id ? "Edit coupon" : "New coupon"}>
          {edit && (
            <form className="grid grid-cols-2 gap-4 p-6" onSubmit={(e) => { e.preventDefault(); save(); }}>
              <Field label="Code" htmlFor="cp-code" className="col-span-2"><Input id="cp-code" className="uppercase" value={edit.v.code} onChange={(e) => upd({ code: e.target.value.toUpperCase() })} required /></Field>
              <Field label="Type" htmlFor="cp-type"><Select id="cp-type" value={edit.v.type} onChange={(e) => upd({ type: e.target.value as CouponType })}><option value="PERCENTAGE">Percentage %</option><option value="FIXED">Fixed ৳</option></Select></Field>
              <Field label={edit.v.type === "FIXED" ? "Amount ৳" : "Percent %"} htmlFor="cp-val"><Input id="cp-val" type="number" min={1} value={edit.v.value} onChange={(e) => upd({ value: e.target.value })} /></Field>
              <Field label="Min order ৳" htmlFor="cp-min"><Input id="cp-min" type="number" min={0} value={edit.v.minOrderValue} onChange={(e) => upd({ minOrderValue: e.target.value })} /></Field>
              {edit.v.type === "PERCENTAGE" && <Field label="Max discount ৳ (optional)" htmlFor="cp-max"><Input id="cp-max" type="number" min={0} value={edit.v.maxDiscount} onChange={(e) => upd({ maxDiscount: e.target.value })} /></Field>}
              <Field label="Usage limit (blank = ∞)" htmlFor="cp-lim"><Input id="cp-lim" type="number" min={0} value={edit.v.usageLimit} onChange={(e) => upd({ usageLimit: e.target.value })} /></Field>
              <Field label="Expiry date (optional)" htmlFor="cp-exp"><Input id="cp-exp" type="date" value={edit.v.expiresAt} onChange={(e) => upd({ expiresAt: e.target.value })} /></Field>
              <label className="col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" className="accent-obsidian" checked={edit.v.isActive} onChange={(e) => upd({ isActive: e.target.checked })} />Active</label>
              <Button type="submit" disabled={pending} className="col-span-2">{pending ? "Saving…" : "Save coupon"}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
