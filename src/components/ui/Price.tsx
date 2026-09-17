import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import type { Money } from "@/types";

interface PriceProps {
  amount: Money;
  compareAt?: Money;
  /** Renders "from ₹x" for items with cheaper configurations. */
  from?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-3xl",
};

export function Price({ amount, compareAt, from, size = "md", className }: PriceProps) {
  const hasDiscount = typeof compareAt === "number" && compareAt > amount;

  return (
    <span className={cn("inline-flex items-baseline gap-1.5 tabular", className)}>
      {from && <span className="text-xs font-medium text-muted">from</span>}
      <span className={cn("font-display font-extrabold tracking-tight text-text", sizes[size])}>
        {formatPrice(amount)}
      </span>
      {hasDiscount && (
        <span className="text-xs font-medium text-muted line-through decoration-muted/70">
          {formatPrice(compareAt)}
        </span>
      )}
    </span>
  );
}
