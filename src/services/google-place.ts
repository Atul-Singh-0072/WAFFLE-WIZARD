import { siteConfig } from "@/lib/config/site";

/**
 * Live rating and review count from the outlet's Google Business listing.
 *
 * Fetched at most once a day and cached by Next, so a year of traffic costs
 * ~365 Places API calls — comfortably inside the free allowance. Without a key
 * (dev, CI, or a misconfigured server) it returns the hand-maintained snapshot
 * in siteConfig instead, so the badge always renders and the build never fails
 * on a missing secret.
 *
 * Google's terms allow caching these figures for up to 30 days; one day keeps
 * the site current without hammering the API.
 */

export interface GoogleRatingData {
  rating: number;
  reviewCount: number;
  /** True when Google was not reached and the siteConfig snapshot is shown. */
  isSnapshot: boolean;
}

const ONE_DAY_SECONDS = 86_400;

function snapshot(): GoogleRatingData {
  return {
    rating: Number(siteConfig.socialProof.googleRating),
    reviewCount: Number(siteConfig.socialProof.googleReviewCount),
    isSnapshot: true,
  };
}

export async function getGoogleRating(): Promise<GoogleRatingData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = siteConfig.social.googlePlaceId;

  if (!apiKey || !placeId) return snapshot();

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        // Field mask is required, and keeps this on the cheapest SKU.
        "X-Goog-FieldMask": "rating,userRatingCount",
      },
      next: { revalidate: ONE_DAY_SECONDS },
    });

    if (!response.ok) {
      console.error(`[google-place] Places API returned ${response.status}; showing the snapshot instead.`);
      return snapshot();
    }

    const data: unknown = await response.json();
    const rating = readNumber(data, "rating");
    const reviewCount = readNumber(data, "userRatingCount");

    // A brand-new listing has no rating yet; the snapshot is no better, so
    // let the caller hide the badge rather than print "0.0".
    if (rating === undefined || reviewCount === undefined) return snapshot();

    return { rating, reviewCount, isSnapshot: false };
  } catch (error) {
    console.error("[google-place] Places API request failed; showing the snapshot instead.", error);
    return snapshot();
  }
}

function readNumber(source: unknown, key: string): number | undefined {
  if (typeof source !== "object" || source === null) return undefined;
  const value = (source as Record<string, unknown>)[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
