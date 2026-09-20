/**
 * Single source of truth for business information.
 *
 * Values wrapped in [SQUARE BRACKETS] are deliberate placeholders — no real
 * business data has been invented. Replace them here and every page, footer,
 * schema.org block and tel: link updates at once.
 */

export const PLACEHOLDER_PREFIX = "[";

/** True for any string still holding an unreplaced placeholder. */
export function isPlaceholder(value: string | undefined): boolean {
  return !!value && value.trim().startsWith(PLACEHOLDER_PREFIX);
}

export const siteConfig = {
  name: "Waffle Wizard",
  shortName: "Waffle Wizard",
  legalName: "[REGISTERED COMPANY NAME]",
  founders: ["Shivam Srivastava", "Ram Lakhan Verma"],
  foundedYear: "2026",
  tagline: "Magic in Every Bite!",
  description:
    "Waffle Wizard — freshly baked, 100% vegetarian pizzas in Lucknow. Classic, premium and signature pizzas, magical combos and a choco pizza to finish. Order for delivery, pickup or dine-in.",

  /**
   * Canonical origin, used for canonical links, sitemap, robots and OG tags.
   * Set NEXT_PUBLIC_SITE_URL in the host's environment (Vercel: Settings →
   * Environment Variables) once the real domain is live; on Vercel the
   * deployment URL is picked up automatically in the meantime.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://wafflewizard.example"),
  locale: "en_IN",
  currency: "INR",
  currencySymbol: "₹",

  contact: {
    /** Primary line, shown first everywhere. */
    phone: "7985795093",
    /** E.164 for tel: links. */
    phoneRaw: "+917985795093",
    /** Second line, shown beside the first. */
    phone2: "9473677414",
    phone2Raw: "+919473677414",
    /** Both lines are on WhatsApp; `raw` is country code + number for wa.me links. */
    whatsapp: [
      { display: "7985795093", raw: "917985795093" },
      { display: "9473677414", raw: "919473677414" },
    ],
    whatsappMessage: "Hi Waffle Wizard! I'd like to place an order.",
    email: "wafflewizard.live@gmail.com",
    support: "wafflewizard.live@gmail.com",
    franchise: "wafflewizard.live@gmail.com",
    careers: "wafflewizard.live@gmail.com",
    hours: "10:00 AM - 11:00 PM, all days",
  },

  headOffice: {
    line1: "Jio Park, Sector C, Aliganj",
    line2: "",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226021",
    country: "IN",
  },

  social: {
    instagram: "https://www.instagram.com/wafflewizard.inn/",
    /**
     * Opens the "write a review" box on the outlet's Google Business listing.
     * The place id is derived from the feature id in the business's own Maps
     * link (0x399957000ea8edaf:0xcc44f056c67ff0f5) and verified to resolve to
     * Waffle Wizard, Sector C, Aliganj. It is stable for the life of the
     * listing — it only changes if the listing itself is recreated.
     */
    googleReview: "https://search.google.com/local/writereview?placeid=ChIJr-2oDgBXmTkR9fB_xlbwRMw",
    /** The listing itself — reviews, photos, directions. */
    googleMaps: "https://maps.google.com/?cid=14719153737641750773",
    /** Same listing, as the id the Places API takes. See services/google-place.ts. */
    googlePlaceId: "ChIJr-2oDgBXmTkR9fB_xlbwRMw",
    facebook: "[FACEBOOK URL]",
    youtube: "[YOUTUBE URL]",
    x: "[X / TWITTER URL]",
  },

  /**
   * Phase 1 is pizza-only. Raising this unlocks categories tagged with a
   * matching `launchPhase` in src/data/categories.ts — no code changes.
   */
  launchPhase: 1 as const,

  /** Order economics. Move to the pricing service when a backend exists. */
  pricing: {
    packagingFee: 20,
    deliveryFee: 39,
    freeDeliveryAbove: 499,
    /** GST on food service, as a fraction. */
    taxRate: 0.05,
  },

  /** Cities with at least one live or announced outlet. */
  serviceCities: ["Lucknow"],

  defaultCity: "Lucknow",

  /**
   * Social proof shown in the footer. Placeholders until the business shares
   * real figures — the UI deliberately renders no filled stars and no number
   * until then, so nothing fabricated ever appears.
   */
  socialProof: {
    customerCount: "[CUSTOMER COUNT]",
    /**
     * Read off the outlet's own Google Business listing on 21 Sep 2026.
     *
     * FALLBACK ONLY. When GOOGLE_PLACES_API_KEY is set, the live figures come
     * from the Places API once a day (services/google-place.ts) and these are
     * never shown. They exist so the badge still renders — with honest, if
     * stale, numbers — in dev, in CI, and if Google ever fails to answer.
     *
     * Deliberately NOT emitted as schema.org aggregateRating: Google's
     * structured-data policy forbids republishing another site's ratings as
     * your own markup.
     */
    googleRating: "5.0",
    googleReviewCount: "23",
    googleAsOf: "September 2026",
  },

  seo: {
    keywords: [
      "Waffle Wizard",
      "veg pizza Lucknow",
      "pizza delivery Lucknow",
      "pizza near me",
      "pizza in Lucknow",
      "pizza takeaway",
      "order pizza online",
    ],
    twitterHandle: "[@HANDLE]",
  },
} as const;

export type SiteConfig = typeof siteConfig;
