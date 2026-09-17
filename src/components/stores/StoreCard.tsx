"use client";

import { Bike, MapPin, Navigation, Phone, ShoppingBag, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { StoreStatusPill } from "@/components/stores/StoreStatusPill";
import { Button } from "@/components/ui/Button";
import { isPlaceholder } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";
import { formatDistance, formatStoreAddress, serviceModeLabels } from "@/lib/utils/format";
import { directionsUrl } from "@/lib/utils/geo";
import { summarizeHours } from "@/lib/utils/hours";
import { useLocation } from "@/store/location-store";
import type { ServiceMode, Store } from "@/types";

interface StoreCardProps {
  store: Store;
  /** Highlighted state when selected on the map. */
  active?: boolean;
  onSelect?: (store: Store) => void;
  compact?: boolean;
  className?: string;
}

const serviceIcon: Record<ServiceMode, typeof Bike> = {
  delivery: Bike,
  pickup: ShoppingBag,
  "dine-in": UtensilsCrossed,
};

export function StoreCard({ store, active = false, onSelect, compact = false, className }: StoreCardProps) {
  const location = useLocation();
  const live = store.status === "live";
  const hours = summarizeHours(store.openingHours);

  const orderHere = () => location.selectStore(store.id);

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-xl border bg-surface p-4 shadow-sm transition-[border-color,box-shadow,transform] duration-200",
        active ? "border-primary shadow-md ring-4 ring-primary-100" : "border-border hover:border-primary-200 hover:shadow-md",
        !live && "bg-surface-2/40",
        className,
      )}
      onMouseEnter={() => onSelect?.(store)}
      onFocus={() => onSelect?.(store)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold leading-tight text-text">
            <Link href={`/stores/${store.slug}`} className="hover:text-primary-800">
              {store.locality}
            </Link>
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <StoreStatusPill store={store} showNext={!compact} />
            {typeof store.distanceKm === "number" && (
              <span className="font-semibold text-muted">· {formatDistance(store.distanceKm)} away</span>
            )}
          </div>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
          <MapPin className="size-4" />
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-text-soft">
        {formatStoreAddress(store)}
      </p>

      {!compact && (
        <ul className="mt-2 text-xs text-muted">
          {hours.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Services">
        {store.services.map((service) => {
          const Icon = serviceIcon[service];
          return (
            <li
              key={service}
              className="inline-flex h-7 items-center gap-1.5 rounded-full bg-surface-2 px-2.5 text-[11px] font-semibold text-text-soft"
            >
              <Icon className="size-3.5 text-primary" />
              {serviceModeLabels[service]}
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        {live ? (
          <Button href="/menu" size="sm" onClick={orderHere} className="flex-1">
            Order now
          </Button>
        ) : (
          <Button size="sm" variant="outline" disabled className="flex-1">
            Opening soon
          </Button>
        )}
        <Button href={`/stores/${store.slug}`} size="sm" variant="outline">
          View store
        </Button>
        <Button
          href={directionsUrl(store)}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          variant="ghost"
          aria-label={`Get directions to ${store.locality}`}
          iconLeft={<Navigation className="size-4" />}
        >
          <span className="max-sm:sr-only">Directions</span>
        </Button>
        {!isPlaceholder(store.phone) && (
          <Button href={`tel:${store.phone}`} size="sm" variant="ghost" aria-label={`Call ${store.locality}`} iconLeft={<Phone className="size-4" />}>
            <span className="max-sm:sr-only">Call</span>
          </Button>
        )}
      </div>
    </article>
  );
}
