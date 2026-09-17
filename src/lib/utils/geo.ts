import type { Coordinates, Store } from "@/types";

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Great-circle distance in km. Accurate enough for "nearest outlet" sorting;
 * swap for a routing API if real driving distance is ever needed.
 */
export function haversineKm(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Annotates stores with distance and sorts nearest-first. */
export function withDistance(stores: Store[], from: Coordinates): Store[] {
  return stores
    .map((store) => ({
      ...store,
      distanceKm: haversineKm(from, {
        latitude: store.latitude,
        longitude: store.longitude,
      }),
    }))
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
}

export function isWithinDeliveryRadius(store: Store, from: Coordinates): boolean {
  return (
    haversineKm(from, { latitude: store.latitude, longitude: store.longitude }) <=
    store.deliveryRadiusKm
  );
}

/** Opens the platform's default maps app with directions to the outlet. */
export function directionsUrl(store: Store): string {
  const destination = `${store.latitude},${store.longitude}`;
  const label = encodeURIComponent(`${store.name}, ${store.locality}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=&travelmode=driving&dir_action=navigate#${label}`;
}

/** Map center and zoom that frame every supplied store. */
export function boundsFor(stores: Store[]): { center: Coordinates; zoom: number } {
  if (stores.length === 0) {
    return { center: { latitude: 26.8467, longitude: 80.9462 }, zoom: 12 };
  }

  const lats = stores.map((s) => s.latitude);
  const lons = stores.map((s) => s.longitude);
  const center = {
    latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
    longitude: (Math.min(...lons) + Math.max(...lons)) / 2,
  };

  // A single outlet opens at street level; wider spreads zoom out to fit.
  const spread = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lons) - Math.min(...lons));
  const zoom =
    stores.length === 1 ? 17 : spread > 0.6 ? 9 : spread > 0.25 ? 10 : spread > 0.12 ? 11 : spread > 0.05 ? 12 : 14;

  return { center, zoom };
}
