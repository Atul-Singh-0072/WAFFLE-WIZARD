"use client";

import { useNow } from "@/hooks/use-now";
import { cn } from "@/lib/utils/cn";
import { getStoreOpenState } from "@/lib/utils/hours";
import type { Store } from "@/types";

interface StoreStatusPillProps {
  store: Store;
  size?: "xs" | "sm";
  showNext?: boolean;
  className?: string;
}

/**
 * Open/closed depends on the viewer's clock, so it reads the shared client
 * clock: unknown (skeleton) on the server, live and ticking after hydration.
 */
export function StoreStatusPill({ store, size = "sm", showNext = false, className }: StoreStatusPillProps) {
  const now = useNow();
  const text = size === "xs" ? "text-[11px]" : "text-xs";

  if (store.status === "coming-soon") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 font-semibold text-secondary-700", text, className)}>
        <span className="size-1.5 rounded-full bg-secondary" />
        Opening soon
      </span>
    );
  }

  if (store.status === "temporarily-closed") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 font-semibold text-muted", text, className)}>
        <span className="size-1.5 rounded-full bg-muted" />
        Temporarily closed
      </span>
    );
  }

  if (now === 0) {
    return <span className={cn("inline-block h-3.5 w-16 rounded skeleton", className)} aria-hidden />;
  }

  const state = getStoreOpenState(store.openingHours, new Date(now));
  const closingSoon = state.label === "Closing soon";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold",
        text,
        state.isOpen ? (closingSoon ? "text-secondary-700" : "text-success") : "text-danger",
        className,
      )}
    >
      <span
        className={cn(
          "relative size-1.5 rounded-full",
          state.isOpen ? (closingSoon ? "bg-secondary" : "bg-success") : "bg-danger",
        )}
      >
        {state.isOpen && !closingSoon && (
          <span className="absolute inset-0 animate-ping rounded-full bg-success/60" aria-hidden />
        )}
      </span>
      {state.label}
      {showNext && state.nextChange && <span className="font-medium text-muted">· {state.nextChange}</span>}
    </span>
  );
}
