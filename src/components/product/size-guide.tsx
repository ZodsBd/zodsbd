"use client";
import { Ruler } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const BELT = {
  title: "Belt Size Guide",
  note: "Choose a belt 2 sizes (≈2 inches) above your trouser waist size. Measured from the buckle fold to the middle hole.",
  head: ["Belt size", "Trouser waist", "Total length"],
  rows: [["32", "30", "92 cm"], ["34", "32", "97 cm"], ["36", "34", "102 cm"], ["38", "36", "107 cm"], ["40", "38", "112 cm"], ["42", "40", "117 cm"]],
};
const BACKPACK = {
  title: "Backpack Capacity Guide",
  note: "Dimensions are H × W × D. Laptop sleeves are padded and measured internally.",
  head: ["Capacity", "Dimensions", "Fits laptop", "Best for"],
  rows: [["15L", "40 × 28 × 12 cm", 'Up to 13"', "Daily essentials, office"], ["20L", "44 × 30 × 15 cm", 'Up to 15.6"', "Work + gym, short trips"], ["25L", "48 × 32 × 18 cm", 'Up to 17"', "Weekend travel, carry-on"]],
};

export function SizeGuide({ kind }: { kind: "belt" | "backpack" }) {
  const g = kind === "belt" ? BELT : BACKPACK;
  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center gap-1.5 text-xs underline underline-offset-4 hover:text-gold-dark"><Ruler className="h-3.5 w-3.5" />Size guide</DialogTrigger>
      <DialogContent title={g.title} description={g.note}>
        <div className="overflow-x-auto p-6">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-obsidian">{g.head.map((h) => <th key={h} scope="col" className="py-2 pr-4 text-[11px] font-medium uppercase tracking-[0.14em]">{h}</th>)}</tr></thead>
            <tbody>{g.rows.map((r) => <tr key={r[0]} className="border-b border-border">{r.map((c, i) => <td key={i} className="py-2.5 pr-4">{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
