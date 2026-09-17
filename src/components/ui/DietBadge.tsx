import { cn } from "@/lib/utils/cn";
import { dietLabels } from "@/lib/utils/format";
import type { DietType } from "@/types";

interface DietBadgeProps {
  diet: DietType;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const colors: Record<DietType, string> = {
  veg: "border-veg text-veg",
  "non-veg": "border-nonveg text-nonveg",
  egg: "border-egg text-egg",
};

/** FSSAI-style square-and-dot indicator every Indian diner recognises. */
export function DietBadge({ diet, showLabel = false, size = "sm", className }: DietBadgeProps) {
  const box = size === "sm" ? "size-3.5" : "size-4";
  const dot = size === "sm" ? "size-1.5" : "size-2";

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      role="img"
      aria-label={dietLabels[diet]}
      title={dietLabels[diet]}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-[3px] border-[1.5px] bg-white",
          box,
          colors[diet],
        )}
      >
        {diet === "egg" ? (
          <span className={cn("rounded-full bg-current", dot, "h-2 w-1.5")} />
        ) : (
          <span className={cn("rounded-full bg-current", dot)} />
        )}
      </span>
      {showLabel && (
        <span className="text-xs font-semibold text-text-soft">{dietLabels[diet]}</span>
      )}
    </span>
  );
}
