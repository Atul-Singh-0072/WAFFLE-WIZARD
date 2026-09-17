import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: ReactNode;
  tone?: "default" | "dark";
}

/** Toggleable pill for filters, service modes and quick picks. */
export function Chip({ selected, icon, tone = "default", className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border-[1.5px] px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary-300/70 active:scale-[0.97]",
        tone === "default" &&
          (selected
            ? "border-primary bg-primary text-white shadow-md"
            : "border-border bg-surface text-text-soft hover:border-primary-300 hover:text-primary-800"),
        tone === "dark" &&
          (selected
            ? "border-secondary bg-secondary text-ink"
            : "border-white/15 bg-white/5 text-white/80 hover:border-white/35 hover:text-white"),
        className,
      )}
      {...props}
    >
      {icon && <span className="-ml-0.5 inline-flex">{icon}</span>}
      {children}
    </button>
  );
}
