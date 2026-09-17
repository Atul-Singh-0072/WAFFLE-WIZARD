"use client";

import { Check, LocateFixed, Search } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { StoreStatusPill } from "@/components/stores/StoreStatusPill";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Field";
import { serviceModes } from "@/data/content";
import { cn } from "@/lib/utils/cn";
import { formatDistance, serviceModeLabels } from "@/lib/utils/format";
import { getIcon } from "@/lib/utils/icons";
import { getLiveStores } from "@/services/stores";
import { useLocation } from "@/store/location-store";
import type { Store } from "@/types";

interface LocationSheetProps {
  open: boolean;
  onClose: () => void;
}

export function LocationSheet({ open, onClose }: LocationSheetProps) {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    if (!open) return;
    getLiveStores().then(setStores);
  }, [open]);

  const modeContent = serviceModes.find((m) => m.mode === location.serviceMode) ?? serviceModes[0];
  const busy = location.status === "locating";

  const onSearch = async (event: FormEvent) => {
    event.preventDefault();
    await location.searchLocation(query);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Where are you ordering?"
      footer={
        <Button fullWidth size="lg" onClick={onClose} disabled={!location.store}>
          {location.store ? `Continue with ${location.store.locality}` : "Choose an outlet to continue"}
        </Button>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-muted">How would you like it?</p>
          <div className="flex gap-2">
            {serviceModes.map((mode) => {
              const Icon = getIcon(mode.icon);
              return (
                <Chip
                  key={mode.mode}
                  selected={location.serviceMode === mode.mode}
                  onClick={() => location.setServiceMode(mode.mode)}
                  icon={<Icon className="size-4" />}
                  className="flex-1 justify-center"
                >
                  {mode.title}
                </Chip>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-muted">{modeContent.prompt}</p>
          <form onSubmit={onSearch} className="flex flex-col gap-2.5">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Locality or pincode, e.g. Gomti Nagar"
              iconLeft={<Search className="size-4" />}
              autoComplete="off"
              enterKeyHint="search"
              rightSlot={
                <Button type="submit" size="sm" variant="secondary" loading={busy}>
                  Find
                </Button>
              }
            />
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => location.locate()}
              loading={busy}
              iconLeft={<LocateFixed className="size-4" />}
            >
              Use my current location
            </Button>
          </form>

          {location.error && (
            <p className="mt-3 rounded-lg bg-accent-50 px-3.5 py-2.5 text-sm text-accent-800" role="alert">
              {location.error}
            </p>
          )}

          {location.store && location.status === "ready" && (
            <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50/60 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-700">Nearest outlet</p>
              <p className="mt-1 font-display text-lg font-bold text-text">{location.store.locality}</p>
              <p className="mt-0.5 text-sm text-muted">
                {typeof location.distanceKm === "number" && `${formatDistance(location.distanceKm)} away · `}
                {location.serviceMode === "delivery"
                  ? location.delivers === false
                    ? "Outside delivery range — try pickup"
                    : "Delivers to you"
                  : `${serviceModeLabels[location.serviceMode]} available`}
              </p>
            </div>
          )}
        </div>

        <div>
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-muted">Or pick an outlet</p>
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            {stores.map((store) => {
              const selected = location.storeId === store.id;
              const supportsMode = store.services.includes(location.serviceMode);
              return (
                <li key={store.id}>
                  <button
                    type="button"
                    onClick={() => location.selectStore(store.id)}
                    disabled={!supportsMode}
                    aria-pressed={selected}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50",
                      selected && "bg-primary-50/70",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold text-text">{store.locality}</span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                        <StoreStatusPill store={store} size="xs" />
                        <span>
                          {supportsMode
                            ? store.services.map((s) => serviceModeLabels[s]).join(" · ")
                            : `No ${serviceModeLabels[location.serviceMode].toLowerCase()} here`}
                        </span>
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px]",
                        selected ? "border-primary bg-primary text-white" : "border-border text-transparent",
                      )}
                      aria-hidden
                    >
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Drawer>
  );
}
