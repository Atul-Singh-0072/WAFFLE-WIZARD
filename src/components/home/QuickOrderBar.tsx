"use client";

import { ArrowRight, LocateFixed, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { StoreStatusPill } from "@/components/stores/StoreStatusPill";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { serviceModes } from "@/data/content";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils/cn";
import { formatDistance, serviceModeLabels } from "@/lib/utils/format";
import { getIcon } from "@/lib/utils/icons";
import { useLocation } from "@/store/location-store";

export function QuickOrderBar() {
  const location = useLocation();
  const router = useRouter();
  const mounted = useMounted();
  const [query, setQuery] = useState("");
  const busy = location.status === "locating";

  const mode = serviceModes.find((m) => m.mode === location.serviceMode) ?? serviceModes[0];
  const ready = mounted && !!location.store;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      const ok = await location.searchLocation(query);
      if (ok) router.push("/menu");
      return;
    }
    if (location.store) router.push("/menu");
  };

  return (
    <section aria-label="Start your order" className="container-page relative z-10 -mt-16 lg:-mt-20">
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-xl md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-6">
          {/* Mode */}
          <div className="lg:w-[19rem] lg:shrink-0">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-muted">Choose how</p>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Service type">
              {serviceModes.map((m) => {
                const Icon = getIcon(m.icon);
                return (
                  <Chip
                    key={m.mode}
                    selected={mounted && location.serviceMode === m.mode}
                    onClick={() => location.setServiceMode(m.mode)}
                    icon={<Icon className="size-4" />}
                    className="h-12 justify-center px-2 text-[13px]"
                  >
                    {m.title}
                  </Chip>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <form onSubmit={onSubmit} className="min-w-0 flex-1">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-muted">{mode.prompt}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <label htmlFor="quick-location" className="sr-only">
                  Locality or pincode
                </label>
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  id="quick-location"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={ready ? `${location.label}` : "Enter locality or pincode"}
                  autoComplete="off"
                  enterKeyHint="go"
                  className="h-12 w-full rounded-full border-[1.5px] border-border bg-surface-2/60 pl-11 pr-32 text-[15px] text-text placeholder:text-muted/80 focus:border-primary-400 focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
                <button
                  type="button"
                  onClick={() => location.locate()}
                  disabled={busy}
                  className="absolute right-1.5 top-1/2 inline-flex h-9 -translate-y-1/2 items-center gap-1.5 rounded-full bg-primary-50 px-3 text-xs font-bold text-primary-800 transition-colors hover:bg-primary-100 disabled:opacity-60"
                >
                  <LocateFixed className={cn("size-3.5", busy && "animate-spin")} />
                  Use my location
                </button>
              </div>
              <Button type="submit" size="lg" className="sm:w-auto" iconRight={<ArrowRight className="size-4" />} loading={busy}>
                Order now
              </Button>
            </div>

            <div className="mt-2.5 min-h-5 text-xs" aria-live="polite">
              {location.error ? (
                <span className="font-medium text-danger">{location.error}</span>
              ) : ready && location.store ? (
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
                  <span>
                    Nearest outlet: <strong className="font-semibold text-text">{location.store.locality}</strong>
                  </span>
                  <StoreStatusPill store={location.store} size="xs" />
                  {typeof location.distanceKm === "number" && <span>· {formatDistance(location.distanceKm)} away</span>}
                  {location.serviceMode === "delivery" && location.delivers === false && (
                    <span className="font-semibold text-accent">· Outside delivery range, try {serviceModeLabels.pickup.toLowerCase()}</span>
                  )}
                </span>
              ) : (
                <span className="text-muted">We will match you to the nearest outlet that offers {mode.title.toLowerCase()}.</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
