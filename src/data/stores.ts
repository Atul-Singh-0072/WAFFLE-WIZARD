import { media } from "@/data/media";
import { uniformHours } from "@/lib/utils/hours";
import type { Store } from "@/types";

/**
 * Outlet records. The business currently trades from a single outlet in
 * Aliganj, Lucknow. Opening hours and the service list below are indicative
 * until confirmed; the street line is the locality until a full address is
 * supplied. Adding a second outlet is one more object in this array.
 */

const STANDARD = uniformHours("10:00", "23:00");

export const stores: Store[] = [
  {
    id: "st-aliganj",
    slug: "lucknow-aliganj",
    name: "Waffle Wizard Aliganj",
    locality: "Aliganj",
    addressLine1: "Jio Park, Sector C",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226021",
    // Jio Park, Sector C. Not in OpenStreetMap, so this was located by matching
    // the surrounding satellite imagery (the park's circular ground, Jankipuram
    // Colony Road to the north, Kursi Road to the east) against the business's
    // own map screenshot. Confirm against a pin dropped at the shop door.
    latitude: 26.905,
    longitude: 80.9549,
    phone: "7985795093",
    email: "mr.pizzawizard@gmail.com",
    openingHours: STANDARD,
    services: ["delivery", "pickup", "dine-in"],
    status: "live",
    deliveryRadiusKm: 6,
    image: media.pizza.cheesyBlast,
  },
];
