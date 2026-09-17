import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
  /** Show only the filled star + number, for compact cards. */
  compact?: boolean;
  className?: string;
}

export function Rating({ value, count, size = "sm", compact = false, className }: RatingProps) {
  const star = size === "sm" ? "size-3.5" : "size-4";

  if (compact) {
    return (
      <span
        className={cn("inline-flex items-center gap-1 text-xs font-semibold text-text", className)}
        aria-label={`Rated ${value} out of 5`}
      >
        <Star className={cn(star, "fill-secondary text-secondary")} aria-hidden />
        <span className="tabular">{value.toFixed(1)}</span>
        {typeof count === "number" && <span className="font-medium text-muted">({count})</span>}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} aria-label={`Rated ${value} out of 5`}>
      <span className="inline-flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(star, i < Math.round(value) ? "fill-secondary text-secondary" : "fill-border text-border")}
          />
        ))}
      </span>
      {typeof count === "number" && (
        <span className="text-xs font-medium text-muted tabular">({count})</span>
      )}
    </span>
  );
}
