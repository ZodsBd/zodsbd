import { Banknote, BadgeCheck, RefreshCcw, Truck } from "lucide-react";

const BADGES = [
  { Icon: Banknote, title: "Cash on Delivery", text: "Pay when your order arrives" },
  { Icon: Truck, title: "Nationwide Delivery", text: "All 64 districts of Bangladesh" },
  { Icon: RefreshCcw, title: "7-Day Exchange", text: "Easy, no-fuss exchanges" },
  { Icon: BadgeCheck, title: "100% Authentic", text: "Genuine materials, guaranteed" },
];

export function TrustBadges() {
  return (
    <ul className="grid grid-cols-2 gap-y-10 border-y border-gold/30 py-12 md:grid-cols-4">
      {BADGES.map(({ Icon, title, text }) => (
        <li key={title} className="flex flex-col items-center px-3 text-center">
          <Icon className="h-7 w-7 text-gold" strokeWidth={1.25} aria-hidden />
          <h3 className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em]">{title}</h3>
          <p className="mt-1.5 text-xs text-warm-dark">{text}</p>
        </li>
      ))}
    </ul>
  );
}
