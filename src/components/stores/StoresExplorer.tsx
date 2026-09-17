"use client";

import { List, LocateFixed, Map as MapIcon, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { StoreCard } from "@/components/stores/StoreCard";
import { StoreMapLoader } from "@/components/stores/StoreMapLoader";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { serviceModes } from "@/data/content";
import { useNow } from "@/hooks/use-now";
import { cn } from "@/lib/utils/cn";
import { withDistance } from "@/lib/utils/geo";
import { getStoreOpenState } from "@/lib/utils/hours";
import { getIcon } from "@/lib/utils/icons";
import { useLocation } from "@/store/location-store";
import type { ServiceMode, Store } from "@/types";

function matches(store: Store, query: string): boolean {
  const hay = [store.name, store.locality, store.city, store.pincode, store.addressLine1].join(" ").toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((t) => hay.includes(t));
}

export function StoresExplorer({ stores }: { stores: Store[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const location = useLocation();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [services, setServices] = useState<ServiceMode[]>([]);
  const [openNow, setOpenNow] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");
  const [hoverId, setHoverId] = useState<string | undefined>();
  const now = useNow();

  // Explicit hover/click wins; otherwise highlight the customer's chosen outlet.
  const activeId = hoverId ?? location.storeId;
  const setActiveId = (id: string) => setHoverId(id);

  const results = useMemo(() => {
    let list = stores;
    if (query.trim()) list = list.filter((s) => matches(s, query));
    if (services.length) list = list.filter((s) => services.every((m) => s.services.includes(m)));
    if (openNow && now) list = list.filter((s) => s.status === "live" && getStoreOpenState(s.openingHours, new Date(now)).isOpen);
    if (location.coords) return withDistance(list, location.coords);
    return [...list].sort((a, b) => Number(b.status === "live") - Number(a.status === "live") || a.locality.localeCompare(b.locality));
  }, [stores, query, services, openNow, now, location.coords]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
    if (query.trim()) location.searchLocation(query);
  };

  const toggleService = (mode: ServiceMode) =>
    setServices((current) => (current.includes(mode) ? current.filter((m) => m !== mode) : [...current, mode]));

  return (
    <div className="border-t border-border">
      {/* Toolbar */}
      <div className="sticky top-[var(--header-h)] z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container-page flex flex-col gap-3 py-3">
          <form onSubmit={onSubmit} className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <label htmlFor="stores-search" className="sr-only">
                Search outlets
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                id="stores-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="City, locality or pincode"
                enterKeyHint="search"
                className="h-11 w-full rounded-full border-[1.5px] border-border bg-surface pl-11 pr-10 text-[15px] text-text placeholder:text-muted/80 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-2">
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Button type="submit" variant="secondary" size="md" className="max-sm:px-4">
              Search
            </Button>
            <Button type="button" variant="outline" size="md" onClick={() => location.locate()} loading={location.status === "locating"} aria-label="Use my location" iconLeft={<LocateFixed className="size-4" />}>
              <span className="max-md:sr-only">Near me</span>
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <div className="no-scrollbar -mx-5 flex flex-1 gap-2 overflow-x-auto px-5 md:-mx-8 md:px-8 xl:-mx-10 xl:px-10" aria-label="Filters">
              {serviceModes.map((m) => {
                const Icon = getIcon(m.icon);
                return (
                  <Chip key={m.mode} selected={services.includes(m.mode)} onClick={() => toggleService(m.mode)} icon={<Icon className="size-4" />} className="h-9 text-[13px]">
                    {m.title}
                  </Chip>
                );
              })}
              <Chip selected={openNow} onClick={() => setOpenNow((v) => !v)} className="h-9 text-[13px]" icon={<span className={cn("size-2 rounded-full", openNow ? "bg-white" : "bg-success")} />}>
                Open now
              </Chip>
            </div>
            <div className="flex shrink-0 overflow-hidden rounded-full border border-border bg-surface lg:hidden" role="group" aria-label="View">
              <button type="button" onClick={() => setView("list")} aria-pressed={view === "list"} className={cn("flex h-9 items-center gap-1.5 px-3 text-xs font-bold", view === "list" ? "bg-primary text-white" : "text-text-soft")}>
                <List className="size-4" /> List
              </button>
              <button type="button" onClick={() => setView("map")} aria-pressed={view === "map"} className={cn("flex h-9 items-center gap-1.5 px-3 text-xs font-bold", view === "map" ? "bg-primary text-white" : "text-text-soft")}>
                <MapIcon className="size-4" /> Map
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-6 py-6 lg:grid-cols-12 lg:py-8">
        {/* List */}
        <div className={cn("lg:col-span-5", view === "map" && "max-lg:hidden")}>
          <p className="mb-3 text-xs font-semibold text-muted" aria-live="polite">
            {results.length} {results.length === 1 ? "outlet" : "outlets"}
            {location.coords ? ", nearest first" : ""}
          </p>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <p className="font-display text-lg font-bold text-text">No outlets match</p>
              <p className="mt-1 text-sm text-muted">Try a nearby locality, or clear the filters.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setQuery("");
                  setServices([]);
                  setOpenNow(false);
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {results.map((store) => (
                <li key={store.id}>
                  <StoreCard store={store} active={store.id === activeId} onSelect={(s) => setActiveId(s.id)} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Map */}
        <div className={cn("lg:col-span-7", view === "list" && "max-lg:hidden")}>
          <div className="h-[60dvh] overflow-hidden rounded-2xl border border-border shadow-md lg:sticky lg:top-[calc(var(--header-h)+7.5rem)] lg:h-[calc(100dvh-var(--header-h)-9rem)]">
            <StoreMapLoader stores={results} activeId={activeId} onSelect={(s) => setActiveId(s.id)} userPosition={location.coords} />
          </div>
        </div>
      </div>
    </div>
  );
}
