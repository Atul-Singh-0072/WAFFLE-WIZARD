import { siteConfig } from "@/lib/config/site";
import type { Money, ServiceMode, DietType, OrderStatus } from "@/types";

/** "₹299" — no decimals, since the menu is priced in whole rupees. */
export function formatPrice(amount: Money): string {
  return `${siteConfig.currencySymbol}${Math.round(amount).toLocaleString("en-IN")}`;
}

/** Signed delta for option rows: "+₹60", "Free". */
export function formatDelta(amount: Money): string {
  if (amount === 0) return "Free";
  const sign = amount > 0 ? "+" : "-";
  return `${sign}${formatPrice(Math.abs(amount))}`;
}

/** "10:00" -> "10:00 AM" */
export function formatTime(time24: string): string {
  const [hRaw, m] = time24.split(":");
  const h = Number(hRaw);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${suffix}`;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export const serviceModeLabels: Record<ServiceMode, string> = {
  delivery: "Delivery",
  pickup: "Pickup",
  "dine-in": "Dine-in",
};

export const dietLabels: Record<DietType, string> = {
  veg: "Veg",
  "non-veg": "Non-veg",
  egg: "Contains egg",
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  placed: "Order placed",
  preparing: "Preparing",
  baking: "In the oven",
  "out-for-delivery": "Out for delivery",
  "ready-for-pickup": "Ready for pickup",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

/** URL-safe slug, used when generating ids from names. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

/**
 * One-line postal address. Drops empty parts and de-duplicates, so an outlet
 * whose street line is just its locality does not read "Aliganj, Aliganj".
 */
export function formatStoreAddress(
  store: {
    addressLine1: string;
    addressLine2?: string;
    locality: string;
    city: string;
    state?: string;
    pincode: string;
  },
  options: { withState?: boolean } = {},
): string {
  const parts = [store.addressLine1, store.addressLine2, store.locality, store.city, options.withState ? store.state : undefined]
    .map((part) => part?.trim())
    .filter((part): part is string => !!part);
  const seen = new Set<string>();
  const unique = parts.filter((part) => {
    const key = part.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return `${unique.join(", ")} ${store.pincode}`.trim();
}
