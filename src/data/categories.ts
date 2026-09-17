import { media } from "@/data/media";
import type { Category } from "@/types";

/**
 * Category table — mirrors the sections of the official menu card.
 *
 * Launching a new range is a data edit, never a rebuild: set
 * `availability: "live"` and a `launchPhase` at or below siteConfig.launchPhase
 * and it appears in navigation, menu tabs, filters and sitemap automatically.
 * `coming-soon` rows render as locked cards and are excluded from every
 * orderable surface; `hidden` rows are kept for later but appear nowhere.
 */
export const categories: Category[] = [
  {
    id: "cat-classic",
    slug: "classic-pizzas",
    name: "Classic Pizzas",
    tagline: "Simple. Tasty. Always a hit!",
    description: "The everyday favourites — cheese-forward, freshly baked, priced for a regular treat.",
    image: media.pizza.margherita,
    icon: "Pizza",
    order: 1,
    availability: "live",
    launchPhase: 1,
  },
  {
    id: "cat-premium",
    slug: "premium-pizzas",
    name: "Premium Pizzas",
    tagline: "Indulge in rich & royal flavors!",
    description: "Loaded builds with more toppings, more sauce and more cheese.",
    image: media.pizza.mushroomSupreme,
    icon: "Crown",
    order: 2,
    availability: "live",
    launchPhase: 1,
  },
  {
    id: "cat-signature",
    slug: "signature-pizzas",
    name: "Signature Pizzas",
    tagline: "Our Special Creations!",
    description: "The Wizard's own recipes — extra cheese, extra happiness.",
    image: media.pizza.cheesyBlast,
    icon: "Sparkles",
    order: 3,
    availability: "live",
    launchPhase: 1,
  },
  {
    id: "cat-combos",
    slug: "magical-combos",
    name: "Magical Combos",
    tagline: "More Pizza · More Fun · More Savings",
    description: "Pizza with a drink — or a full spread with fries — at a lower price than ordering apart.",
    image: media.pizza.veggieDelight,
    icon: "Package",
    order: 4,
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
    order: 5,
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
    order: 6,
    availability: "coming-soon",
    launchPhase: 2,
    comingSoonNote: "Coming soon",
  },

  /* ---------------- Parked: flip to "live" to relaunch ---------------- */

  {
    id: "cat-buffalo",
    slug: "buffalo",
    name: "Buffalo",
    tagline: "Slow-cooked & sauced",
    description: "A buffalo-based range in development.",
    image: media.pizza.classic,
    icon: "Flame",
    order: 7,
    availability: "hidden",
    launchPhase: 2,
  },
  {
    id: "cat-sides",
    slug: "sides",
    name: "Sides",
    tagline: "The supporting act",
    description: "Garlic breads, loaded fries and crisp bites built to share.",
    image: media.sides.fries,
    icon: "Drumstick",
    order: 8,
    availability: "hidden",
    launchPhase: 1,
  },
];
