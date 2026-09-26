import type { Order, OrderItem, StoreSettings } from "@prisma/client";
import { PrintButton } from "./print-button";
import { formatBDT } from "@/lib/money";
import { zoneLabel } from "@/lib/shipping";
import { formatDate } from "@/lib/utils";

type Props = { kind: "invoice" | "packing"; order: Order & { items: OrderItem[] }; settings: StoreSettings };

/** A4 invoice / packing slip. Screen shows a preview; print CSS strips chrome. */
export function PrintDoc({ kind, order: o, settings: s }: Props) {
  const invoice = kind === "invoice";
  return (
    <div className="min-h-screen bg-neutral-200 py-8 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-4 flex max-w-[210mm] justify-end gap-2 px-4"><PrintButton /></div>
      <article className="print-sheet mx-auto min-h-[297mm] max-w-[210mm] bg-white p-[14mm] text-[12px] leading-relaxed text-black shadow">
        <header className="flex items-start justify-between border-b-2 border-black pb-4">
          <div>
            <p className="font-serif text-2xl font-semibold tracking-[0.3em]">ZOD&apos;S <span className="text-[#8C6F12]">BD</span></p>
            <p className="mt-1 text-[11px] text-neutral-600">{s.address}</p>
            <p className="text-[11px] text-neutral-600">{[s.contactPhone, s.contactEmail].filter(Boolean).join(" · ")}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold uppercase tracking-widest">{invoice ? "Invoice" : "Packing Slip"}</p>
            <p className="font-mono text-sm">{o.orderNumber}</p>
            <p className="text-[11px] text-neutral-600">{formatDate(o.createdAt, true)}</p>
          </div>
        </header>
        <section className="mt-6 grid grid-cols-2 gap-8">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">Ship to</p>
            <p className="text-sm font-semibold">{o.customerName}</p>
            <p>{o.phone}</p>
            <p className="whitespace-pre-line">{o.address}</p>
            <p>{o.thana}, {o.district}</p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">Delivery</p>
            <p>{zoneLabel(o.zone)}</p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">Payment</p>
            <p>Cash on Delivery</p>
            {invoice && <p className="mt-3 inline-block border-2 border-black px-3 py-1 text-base font-bold">COLLECT {formatBDT(o.total)}</p>}
          </div>
        </section>
        <table className="mt-8 w-full border-collapse text-left">
          <thead>
            <tr className="border-y border-black text-[10px] uppercase tracking-widest">
              <th className="py-2">Item</th><th className="py-2">SKU</th><th className="py-2 text-center">Qty</th>
              {invoice ? <><th className="py-2 text-right">Unit</th><th className="py-2 text-right">Total</th></> : <th className="py-2 text-center">✓</th>}
            </tr>
          </thead>
          <tbody>
            {o.items.map((it) => (
              <tr key={it.id} className="border-b border-neutral-300">
                <td className="py-2"><p className="font-medium">{it.productName}</p>{it.variantLabel && <p className="text-[11px] text-neutral-600">{it.variantLabel}</p>}</td>
                <td className="py-2 font-mono text-[11px]">{it.sku}</td>
                <td className="py-2 text-center">{it.quantity}</td>
                {invoice ? <><td className="py-2 text-right">{formatBDT(it.unitPrice)}</td><td className="py-2 text-right">{formatBDT(it.lineTotal)}</td></> : <td className="py-2 text-center"><span className="inline-block h-4 w-4 border border-black" /></td>}
              </tr>
            ))}
          </tbody>
        </table>
        {invoice ? (
          <table className="ml-auto mt-4 w-64">
            <tbody>
              <tr><td className="py-1">Subtotal</td><td className="text-right">{formatBDT(o.subtotal)}</td></tr>
              {o.discount > 0 && <tr><td className="py-1">Discount {o.couponCode && `(${o.couponCode})`}</td><td className="text-right">−{formatBDT(o.discount)}</td></tr>}
              <tr><td className="py-1">Shipping</td><td className="text-right">{formatBDT(o.shippingFee)}</td></tr>
              <tr className="border-t-2 border-black text-sm font-bold"><td className="py-2">Total due</td><td className="text-right">{formatBDT(o.total)}</td></tr>
            </tbody>
          </table>
        ) : (
          <p className="mt-6 text-[11px]">Total items: {o.items.reduce((n, i) => n + i.quantity, 0)}</p>
        )}
        {o.notes && <p className="mt-6 border border-neutral-400 p-3 text-[11px]"><strong>Customer note:</strong> {o.notes}</p>}
        <footer className="mt-12 border-t border-neutral-300 pt-4 text-center text-[11px] text-neutral-600">
          {invoice ? "Thank you for choosing Zod's Bd. 7-day exchange on unused items in original packaging." : "Packed with care by Zod's Bd. Please check all items before sealing."}
        </footer>
      </article>
    </div>
  );
}
