import { stores } from "@/data/stores";
import { haversineKm, withDistance } from "@/lib/utils/geo";
import { getStoreOpenState } from "@/lib/utils/hours";
import type { Coordinates, ID, ServiceMode, Store, StoreFilters } from "@/types";

/** Store read API. Swap bodies for network calls; signatures stay put. */

export async function getStores(): Promise<Store[]> {
  return [...stores];
}

/** Outlets a customer can order from right now. */
export async function getLiveStores(): Promise<Store[]> {
  return stores.filter((store) => store.status === "live");
}

export async function getStoreBySlug(slug: string): Promise<Store | undefined> {
  return stores.find((store) => store.slug === slug);
}

export async function getStoreById(id: ID): Promise<Store | undefined> {
  return stores.find((store) => store.id === id);
}

export async function getStoreSlugs(): Promise<string[]> {
  return stores.map((store) => store.slug);
}

export async function getCities(): Promise<string[]> {
  return Array.from(new Set(stores.map((store) => store.city))).sort();
}

function matchesStoreQuery(store: Store, query: string): boolean {
  const haystack = [
    store.name,
    store.locality,
    store.city,
    store.pincode,
    store.addressLine1,
    store.addressLine2 ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

/**
 * Unified search across city, locality, pincode and name, with optional
 * service and open-now filters. When `near` is supplied the result is sorted
 * by distance and annotated with `distanceKm`.
 */
export async function searchStores(filters: StoreFilters = {}): Promise<Store[]> {
  let result = [...stores];

  if (filters.city) {
    result = result.filter((store) => store.city.toLowerCase() === filters.city!.toLowerCase());
  }
  if (filters.query?.trim()) {
    result = result.filter((store) => matchesStoreQuery(store, filters.query!));
  }
  if (filters.services?.length) {
    result = result.filter((store) =>
      filters.services!.every((service: ServiceMode) => store.services.includes(service)),
    );
  }
  if (filters.openNow) {
    result = result.filter(
      (store) => store.status === "live" && getStoreOpenState(store.openingHours).isOpen,
    );
  }

  if (filters.near) {
    return withDistance(result, filters.near);
  }

  // Live outlets first, then announced ones, alphabetical within each.
  return result.sort(
    (a, b) =>
      Number(b.status === "live") - Number(a.status === "live") ||
      a.locality.localeCompare(b.locality),
  );
}

/** The closest live outlet, plus whether it will deliver to that point. */
export async function findNearestStore(
  from: Coordinates,
): Promise<{ store: Store; distanceKm: number; delivers: boolean } | undefined> {
  const live = await getLiveStores();
  if (live.length === 0) return undefined;

  const [nearest] = withDistance(live, from);
  const distanceKm =
    nearest.distanceKm ??
    haversineKm(from, { latitude: nearest.latitude, longitude: nearest.longitude });

  return { store: nearest, distanceKm, delivers: distanceKm <= nearest.deliveryRadiusKm };
}

/**
 * Lightweight geocoder for demo purposes: matches a typed locality or pincode
 * against known outlet areas. Replace with a real geocoding service for
 * arbitrary street addresses.
 */
export async function geocodeQuery(query: string): Promise<Coordinates | undefined> {
  const match = stores.find((store) => matchesStoreQuery(store, query));
  return match ? { latitude: match.latitude, longitude: match.longitude } : undefined;
}
