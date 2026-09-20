import { media } from "@/data/media";
import type { Category } from "@/types";

/**
 * Category table — the sections of the menu card.
 *
 * Launching a new range is a data edit, never a rebuild: set
 * `availability: "live"` and a `launchPhase` at or below siteConfig.launchPhase
 * and it appears in navigation, menu tabs, filters and sitemap automatically.
 * `coming-soon` rows render as locked cards and are excluded from every
 * orderable surface; `hidden` rows are kept for later but appear nowhere.
 */
export const categories: Category[] = [
  {
    id: "cat-pizza",
    slug: "pizza",
    name: "Pizza",
    tagline: "Hot · Fresh · Delicious",
    description:
      "Nineteen pizzas, all vegetarian, all baked to order. Small, medium and large — priced exactly as on our card.",
    image: media.pizza.cheesePull,
    icon: "Pizza",
    order: 1,
    availability: "live",
    launchPhase: 1,
  },
  {
    id: "cat-burgers",
    slug: "burgers",
    name: "Burgers",
    tagline: "Soft bun, big filling",
    description: "Three vegetarian burgers — pizza-style, tandoori and paneer.",
    image: media.burger.garden,
    icon: "Sandwich",
    order: 2,
    availability: "live",
    launchPhase: 1,
  },
  {
    id: "cat-combos",
    slug: "magical-combos",
    name: "Magical Combos",
    tagline: "More Pizza · More Fun · More Savings",
    description: "Pizza with a drink — or a full spread with fries — at a lower price than ordering apart.",
    image: media.pizza.gardenVeg,
    icon: "Package",
    order: 3,
    availability: "live",
    launchPhase: 1,
  },
  {
    id: "cat-choco",
    slug: "choco-pizza",
    name: "Choco Pizza",
    tagline: "Sweet Endings Are the Best!",
    description: "A dessert pizza with chocolate and toppings, in three sizes.",
    image: media.poster.chocoPizza,
    icon: "IceCreamCone",
    order: 4,
    availability: "live",
    launchPhase: 1,
  },

  /* ---------------- Announced, not orderable ---------------- */

  {
    id: "cat-waffles",
    slug: "waffle-zone",
    name: "Waffle Zone",
    tagline: "Coming soon",
    description:
      "Belgian-style waffles — classic, premium, fruit and savoury — are being perfected in the kitchen. Not available to order yet.",
    image: media.waffles.classic,
    icon: "Grid2x2",
    order: 5,
    availability: "coming-soon",
    launchPhase: 2,
    comingSoonNote: "Coming soon",
  },

  /* ---------------- Parked: flip to "live" to relaunch ---------------- */

  {
    id: "cat-sides",
    slug: "sides",
    name: "Sides",
    tagline: "The supporting act",
    description: "Garlic breads, loaded fries and crisp bites built to share.",
    image: media.sides.fries,
    icon: "Drumstick",
    order: 6,
    availability: "hidden",
    launchPhase: 1,
  },
];
