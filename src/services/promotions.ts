import { coupons, offers } from "@/data/offers";
import type { Coupon, Offer } from "@/types";

export async function getOffers(): Promise<Offer[]> {
  return [...offers].sort((a, b) => a.order - b.order);
}

export async function getFeaturedOffers(limit = 4): Promise<Offer[]> {
  const all = await getOffers();
  return all.filter((offer) => offer.featured).slice(0, limit);
}

export async function getOfferBySlug(slug: string): Promise<Offer | undefined> {
  return offers.find((offer) => offer.slug === slug);
}

export async function getCouponByCode(code: string): Promise<Coupon | undefined> {
  const normalized = code.trim().toUpperCase();
  return coupons.find((coupon) => coupon.code === normalized && coupon.active);
}

/** Codes surfaced as one-tap chips in the cart. */
export async function getSuggestedCoupons(limit = 3): Promise<Coupon[]> {
  return coupons.filter((coupon) => coupon.active).slice(0, limit);
}
