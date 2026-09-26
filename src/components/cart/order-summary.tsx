import { formatBDT } from "@/lib/money";
import { cn } from "@/lib/utils";

export function SummaryRows({ subtotal, discount, shippingFee, total, couponCode, shippingLabel, className }: {
  subtotal: number; discount: number; shippingFee: number | null; total: number; couponCode?: string | null; shippingLabel?: string; className?: string;
}) {
  return (
    <dl className={cn("space-y-3 text-sm", className)}>
      <Row label="Subtotal" value={formatBDT(subtotal)} />
      {discount > 0 && <Row label={`Discount${couponCode ? ` (${couponCode})` : ""}`} value={`−${formatBDT(discount)}`} className="text-gold-dark" />}
      <Row label={`Shipping${shippingLabel ? ` · ${shippingLabel}` : ""}`} value={shippingFee === null ? "—" : formatBDT(shippingFee)} />
      <div className="hairline pt-3" />
      <Row label="Total" value={formatBDT(total)} className="text-base font-semibold" />
      <p className="text-xs text-warm-dark">Pay with cash when your order arrives.</p>
    </dl>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("flex justify-between gap-4", className)}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
