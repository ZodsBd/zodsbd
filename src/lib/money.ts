const fmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Formats whole-taka integers as ৳2,450 */
export function formatBDT(amount: number): string {
  return `৳${fmt.format(Math.round(amount))}`;
}

export function discountPercent(price: number, compareAt?: number | null): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
