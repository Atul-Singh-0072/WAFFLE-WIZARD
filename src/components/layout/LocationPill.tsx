"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import { LocationSheet } from "@/components/layout/LocationSheet";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils/cn";
import { serviceModeLabels } from "@/lib/utils/format";
import { useLocation } from "@/store/location-store";

interface LocationPillProps {
  /** `compact` hides the text label below md. */
  compact?: boolean;
  tone?: "light" | "dark";
  className?: string;
}

export function LocationPill({ compact = true, tone = "light", className }: LocationPillProps) {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const { serviceMode, label, store } = useLocation();

  const primary = mounted && label ? label : "Set location";
  const secondary = mounted ? serviceModeLabels[serviceMode] : "";
  const dark = tone === "dark";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Location: ${primary}. ${secondary}. Change`}
        className={cn(
          "group inline-flex h-11 max-w-[15rem] items-center gap-2 rounded-full border-[1.5px] pl-2.5 pr-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary-300/70",
          dark
            ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
            : "border-border bg-surface text-text hover:border-primary-300 hover:bg-primary-50",
          compact && "max-md:size-11 max-md:justify-center max-md:px-0",
          className,
        )}
      >
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full",
            dark ? "bg-secondary text-ink" : "bg-primary-50 text-primary",
          )}
        >
          <MapPin className="size-4" />
        </span>
        <span className={cn("min-w-0 flex-1", compact && "max-md:hidden")}>
          <span className={cn("block text-[10px] font-bold uppercase leading-none tracking-[0.14em]", dark ? "text-white/60" : "text-muted")}>
            {secondary || "Order"}
          </span>
          <span className="mt-0.5 block truncate text-[13px] font-semibold leading-tight">
            {primary}
            {store && label !== `${store.locality}, ${store.city}` ? ` · ${store.locality}` : ""}
          </span>
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform group-aria-expanded:rotate-180", compact && "max-md:hidden", dark ? "text-white/60" : "text-muted")}
        />
      </button>
      <LocationSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
