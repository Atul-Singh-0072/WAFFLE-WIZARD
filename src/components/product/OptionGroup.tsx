"use client";

import { Check } from "lucide-react";
import { DietBadge } from "@/components/ui/DietBadge";
import { cn } from "@/lib/utils/cn";
import { formatDelta, formatPrice } from "@/lib/utils/format";
import type { AddonGroup, VariantGroup } from "@/types";

interface SingleProps {
  group: VariantGroup;
  value: string;
  onChange: (optionId: string) => void;
  /** Needed for `priceMode: "absolute"` groups to print the full size price. */
  basePrice?: number;
}

interface MultiProps {
  group: AddonGroup;
  value: string[];
  onChange: (optionIds: string[]) => void;
  basePrice?: number;
}

type OptionGroupProps = SingleProps | MultiProps;

/**
 * Renders any variant (radio) or addon (checkbox) group from the catalog.
 * Uses native inputs for accessibility; the card is purely presentational.
 */
export function OptionGroup(props: OptionGroupProps) {
  const { group, basePrice = 0 } = props;
  const isMulti = group.type === "multi";
  const absolute = !isMulti && (group as VariantGroup).priceMode === "absolute";
  const selectedIds = isMulti ? (props as MultiProps).value : [(props as SingleProps).value];
  const atMax = isMulti && typeof group.max === "number" && selectedIds.length >= group.max;

  const toggle = (optionId: string) => {
    if (isMulti) {
      const { value, onChange } = props as MultiProps;
      onChange(value.includes(optionId) ? value.filter((id) => id !== optionId) : [...value, optionId]);
    } else {
      (props as SingleProps).onChange(optionId);
    }
  };

  return (
    <fieldset>
      <legend className="flex w-full items-baseline justify-between gap-3">
        <span className="font-display text-lg font-bold text-text">{group.name}</span>
        <span className="text-xs font-semibold text-muted">
          {isMulti ? (group.max ? `Up to ${group.max}` : "Optional") : "Required"}
        </span>
      </legend>
      {group.hint && <p className="mt-1 text-sm text-muted">{group.hint}</p>}

      <div className={cn("mt-3 grid gap-2", isMulti ? "sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2")}>
        {group.options.map((option) => {
          const checked = selectedIds.includes(option.id);
          const disabled = !option.available || (isMulti && atMax && !checked);
          const inputId = `${group.id}-${option.id}`;
          return (
            <label
              key={option.id}
              htmlFor={inputId}
              className={cn(
                "group/opt relative flex cursor-pointer items-center gap-3 rounded-xl border-[1.5px] p-3 transition-[border-color,background-color,box-shadow]",
                checked ? "border-primary bg-primary-50/70 shadow-xs" : "border-border bg-surface hover:border-primary-200",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <input
                id={inputId}
                type={isMulti ? "checkbox" : "radio"}
                name={group.id}
                value={option.id}
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(option.id)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center border-[1.5px] transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-secondary-300/70",
                  isMulti ? "rounded-md" : "rounded-full",
                  checked ? "border-primary bg-primary text-white" : "border-border bg-surface",
                )}
                aria-hidden
              >
                {checked && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  {option.diet && <DietBadge diet={option.diet} />}
                  <span className="truncate text-sm font-semibold text-text">{option.name}</span>
                  {option.badge && (
                    <span className="rounded-full bg-secondary-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary-800">
                      {option.badge}
                    </span>
                  )}
                </span>
                {option.description && <span className="mt-0.5 block text-xs text-muted">{option.description}</span>}
              </span>
              <span className={cn("shrink-0 text-sm font-bold tabular", !absolute && option.priceDelta === 0 ? "text-muted" : "text-secondary")}>
                {absolute ? formatPrice(basePrice + option.priceDelta) : formatDelta(option.priceDelta)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
