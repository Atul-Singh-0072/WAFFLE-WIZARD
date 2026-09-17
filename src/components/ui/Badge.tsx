import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeTone = "neutral" | "primary" | "gold" | "ember" | "success" | "danger" | "dark" | "glass";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: "sm" | "md";
}

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-text-soft border-border",
  primary: "bg-primary-50 text-primary-800 border-primary-100",
  gold: "bg-secondary-100 text-secondary-800 border-secondary-200",
  ember: "bg-accent-50 text-accent-700 border-accent-100",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  danger: "bg-red-50 text-red-700 border-red-100",
  dark: "bg-ink text-white border-ink",
  glass: "bg-white/85 text-ink border-white/60 backdrop-blur",
};

export function Badge({ tone = "neutral", size = "sm", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-semibold leading-none whitespace-nowrap",
        size === "sm" ? "h-6 px-2.5 text-[11px] tracking-wide" : "h-7 px-3 text-xs",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
