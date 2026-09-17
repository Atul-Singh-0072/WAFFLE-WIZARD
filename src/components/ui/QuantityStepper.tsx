"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  /** Shows a bin icon in place of minus when at the minimum. */
  removeAtMin?: boolean;
  className?: string;
  label?: string;
}

const sizes = {
  sm: { wrap: "h-9", btn: "size-9", text: "w-8 text-sm", icon: "size-3.5" },
  md: { wrap: "h-11", btn: "size-11", text: "w-10 text-base", icon: "size-4" },
  lg: { wrap: "h-12", btn: "size-12", text: "w-12 text-lg", icon: "size-4.5" },
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  size = "md",
  removeAtMin = false,
  className,
  label = "Quantity",
}: QuantityStepperProps) {
  const s = sizes[size];
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-full border-[1.5px] border-primary-200 bg-surface",
        s.wrap,
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={atMin && !removeAtMin}
        aria-label={atMin && removeAtMin ? "Remove" : "Decrease quantity"}
        className={cn(
          "flex items-center justify-center text-primary-800 transition-colors hover:bg-primary-50 disabled:opacity-35 focus-visible:outline-none focus-visible:bg-primary-50",
          s.btn,
        )}
      >
        {atMin && removeAtMin ? <Trash2 className={cn(s.icon, "text-danger")} /> : <Minus className={s.icon} />}
      </button>
      <span className={cn("text-center font-display font-bold tabular text-text", s.text)} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={atMax}
        aria-label="Increase quantity"
        className={cn(
          "flex items-center justify-center text-primary-800 transition-colors hover:bg-primary-50 disabled:opacity-35 focus-visible:outline-none focus-visible:bg-primary-50",
          s.btn,
        )}
      >
        <Plus className={s.icon} />
      </button>
    </div>
  );
}
