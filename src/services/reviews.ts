import { reviews } from "@/data/reviews";
import type { ID, Review } from "@/types";

/**
 * Reviews read API. Replace bodies with a Google Places / first-party fetch.
 * Consumers check `source === "placeholder"` to decide whether to show the
 * "sample content" notice, so real data switches the notice off by itself.
 */

export async function getReviews(limit = 6): Promise<Review[]> {
  return [...reviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export async function getReviewsForProduct(productId: ID, limit = 4): Promise<Review[]> {
  return reviews.filter((review) => review.productId === productId).slice(0, limit);
}

export async function getReviewsForStore(storeId: ID, limit = 4): Promise<Review[]> {
  return reviews.filter((review) => review.storeId === storeId).slice(0, limit);
}

export interface RatingSummary {
  average: number;
  count: number;
  isPlaceholder: boolean;
}

export async function getRatingSummary(list?: Review[]): Promise<RatingSummary> {
  const source = list ?? reviews;
  if (source.length === 0) return { average: 0, count: 0, isPlaceholder: false };
  const total = source.reduce((sum, review) => sum + review.rating, 0);
  return {
    average: Math.round((total / source.length) * 10) / 10,
    count: source.length,
    isPlaceholder: source.some((review) => review.source === "placeholder"),
  };
}
