import { formatUSD } from "@/lib/utils";

export function PriceSummary({
  base,
  optionsTotal = 0,
  travelers = 1,
}: {
  base: number;
  optionsTotal?: number;
  travelers?: number;
}) {
  const subtotal = base * travelers + optionsTotal;
  const taxes = Math.round(subtotal * 0.1 * 100) / 100; // 10% example
  const total = subtotal + taxes;
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between"><span>Subtotal</span><span>{formatUSD(subtotal)}</span></div>
      <div className="flex justify-between"><span>Taxes & Fees</span><span>{formatUSD(taxes)}</span></div>
      <div className="flex justify-between font-semibold text-emerald-900"><span>Total</span><span>{formatUSD(total)}</span></div>
    </div>
  );
}


