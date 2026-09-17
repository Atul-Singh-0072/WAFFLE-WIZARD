import type { Review } from "@/types";

/**
 * PLACEHOLDER REVIEWS.
 *
 * Every entry is marked `source: "placeholder"` and is written to illustrate
 * layout only — none of it represents a real customer, rating or order. The UI
 * labels this section as sample content.
 *
 * To go live, replace this array with a fetch in `src/services/reviews.ts`
 * (Google Places, Zomato, or a first-party reviews table). Keep the `source`
 * field populated so placeholder content can never ship unnoticed.
 */
export const reviews: Review[] = [
  {
    id: "rv-1",
    author: "Sample reviewer",
    initials: "SR",
    rating: 5,
    title: "The crust is the thing",
    body: "Placeholder review copy. Real customer feedback will appear here once a reviews source is connected to the site.",
    city: "Lucknow",
    date: "2026-08-14",
    verifiedOrder: true,
    productId: "p-sorcerers-seven",
    source: "placeholder",
  },
  {
    id: "rv-2",
    author: "Sample reviewer",
    initials: "SR",
    rating: 5,
    title: "Arrived hot",
    body: "Placeholder review copy covering delivery experience. Replace with verified order feedback from the ordering backend.",
    city: "Lucknow",
    date: "2026-08-09",
    verifiedOrder: true,
    storeId: "st-gomti-nagar",
    source: "placeholder",
  },
  {
    id: "rv-3",
    author: "Sample reviewer",
    initials: "SR",
    rating: 4,
    title: "Good value combo",
    body: "Placeholder review copy about the combo pricing. Swap for real content before launch.",
    city: "Lucknow",
    date: "2026-07-30",
    verifiedOrder: true,
    productId: "c-duo",
    source: "placeholder",
  },
  {
    id: "rv-4",
    author: "Sample reviewer",
    initials: "SR",
    rating: 5,
    title: "Easy to order",
    body: "Placeholder review copy referencing the ordering flow. Real ratings should come from verified orders only.",
    city: "Lucknow",
    date: "2026-07-22",
    verifiedOrder: false,
    source: "placeholder",
  },
  {
    id: "rv-5",
    author: "Sample reviewer",
    initials: "SR",
    rating: 4,
    title: "Will reorder",
    body: "Placeholder review copy. This card demonstrates the four-star state of the rating component.",
    city: "Lucknow",
    date: "2026-07-11",
    verifiedOrder: true,
    productId: "p-chicken-pepperoni",
    source: "placeholder",
  },
  {
    id: "rv-6",
    author: "Sample reviewer",
    initials: "SR",
    rating: 5,
    title: "Dine-in was comfortable",
    body: "Placeholder review copy about an in-store visit. Connect a reviews API to replace this section wholesale.",
    city: "Lucknow",
    date: "2026-07-03",
    verifiedOrder: true,
    storeId: "st-hazratganj",
    source: "placeholder",
  },
];

/** True while any review on the page is still placeholder content. */
export function hasPlaceholderReviews(list: Review[] = reviews): boolean {
  return list.some((review) => review.source === "placeholder");
}
