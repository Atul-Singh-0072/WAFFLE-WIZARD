import { media } from "@/data/media";
import type { Coupon, Offer } from "@/types";

/**
 * Offers mirror the "Magical Combos" printed on the menu card — the only
 * discounts the business has published. Savings are the card's own
 * strike-through prices. No promo codes have been invented; add real ones to
 * `coupons` when the business issues them.
 */

export const offers: Offer[] = [
  {
    id: "of-classic-combo",
    slug: "classic-combo",
    title: "Classic Combo",
    subtitle: "Any Classic Pizza + Drink",
    description: "₹129 instead of ₹179 — pick any classic pizza and we add a chilled drink.",
    image: media.pizza.gardenVeg,
    discountLabel: "SAVE ₹50",
    badge: "₹129",
    href: "/menu/classic-combo",
    terms: ["Small (6\") pizza with one chilled drink.", "Add-ons charged as printed."],
    featured: true,
    order: 1,
  },
  {
    id: "of-premium-combo",
    slug: "premium-combo",
    title: "Premium Combo",
    subtitle: "Any Premium Pizza + Drink",
    description: "₹169 instead of ₹249 — any premium pizza with a chilled drink.",
    image: media.pizza.mushroomTomato,
    discountLabel: "SAVE ₹80",
    badge: "₹169",
    href: "/menu/premium-combo",
    terms: ["Small (6\") premium pizza with one chilled drink.", "Add-ons charged as printed."],
    featured: true,
    order: 2,
  },
  {
    id: "of-family-combo",
    slug: "family-combo",
    title: "Family Combo",
    subtitle: "2 Medium Pizzas + 2 Drinks + Fries",
    description: "₹299 instead of ₹449 — two medium pizzas, two drinks and fries.",
    image: media.pizza.basilStone,
    discountLabel: "SAVE ₹150",
    badge: "₹299",
    href: "/menu/family-combo",
    terms: ["Two medium (9\") pizzas of your choice.", "Two chilled drinks and one portion of fries."],
    featured: true,
    order: 3,
  },
  {
    id: "of-pizza-party-combo",
    slug: "pizza-party-combo",
    title: "Pizza Party Combo",
    subtitle: "3 Large Pizzas + 3 Drinks + Fries",
    description: "₹459 instead of ₹699 — three large pizzas, three drinks and fries.",
    image: media.pizza.cheeseSlices,
    discountLabel: "SAVE ₹240",
    badge: "₹459",
    href: "/menu/pizza-party-combo",
    terms: ["Three large (12\") pizzas of your choice.", "Three chilled drinks and one portion of fries."],
    featured: true,
    order: 4,
  },
];

/** No promo codes have been published by the business yet. */
export const coupons: Coupon[] = [];
