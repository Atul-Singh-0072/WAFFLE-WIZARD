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
    addressLine1: "Aliganj",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226021",
    latitude: 26.8894,
    longitude: 80.9394,
    phone: "7985795093",
    email: "mr.pizzawizard@gmail.com",
    openingHours: STANDARD,
    services: ["delivery", "pickup", "dine-in"],
    status: "live",
    deliveryRadiusKm: 6,
    image: media.pizza.cheesyBlast,
  },
];
