import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import type { PriceBreakdown, ServiceMode } from "@/types";

interface CartSummaryProps {
  breakdown: PriceBreakdown;
  serviceMode: ServiceMode;
  className?: string;
}

export function CartSummary({ breakdown, serviceMode, className }: CartSummaryProps) {
  const rows: { label: string; value: number; tone?: "discount" | "free" }[] = [
    { label: "Item total", value: breakdown.subtotal },
  ];
  if (breakdown.discount > 0) rows.push({ label: "Discount", value: -breakdown.discount, tone: "discount" });
  if (serviceMode !== "dine-in") rows.push({ label: "Packaging", value: breakdown.packagingFee });
  if (serviceMode === "delivery") {
    rows.push({ label: "Delivery", value: breakdown.deliveryFee, tone: breakdown.deliveryFee === 0 ? "free" : undefined });
  }
  rows.push({ label: "Taxes (GST)", value: breakdown.taxes });

  return (
    <dl className={cn("space-y-2 rounded-xl border border-border bg-surface-2/50 p-4 text-sm", className)}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4">
          <dt className="text-text-soft">{row.label}</dt>
          <dd
            className={cn(
              "font-semibold tabular",
              row.tone === "discount" && "text-success",
              row.tone === "free" && "text-success",
            )}
          >
            {row.tone === "free" ? "Free" : row.value < 0 ? `- ${formatPrice(-row.value)}` : formatPrice(row.value)}
          </dd>
        </div>
      ))}
      <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
        <dt className="font-display text-base font-bold text-text">To pay</dt>
        <dd className="font-display text-xl font-extrabold tabular text-text">{formatPrice(breakdown.total)}</dd>
      </div>
    </dl>
  );
}
