/**
 * Domain model for the Waffle Wizard ordering platform.
 * These entities mirror the shape a REST/GraphQL backend would return, so
 * `src/services/*` can swap local data for network calls without touching UI.
 */

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

/** Amount in whole Indian rupees. */
export type Money = number;

export type ID = string;

export type ServiceMode = "delivery" | "pickup" | "dine-in";

export type DietType = "veg" | "non-veg" | "egg";

/**
 * Drives what a customer may buy today versus what is merely announced.
 * Phase 2 categories (buffalo, waffles) ship as `coming-soon`.
 */
export type Availability = "live" | "coming-soon" | "sold-out" | "hidden";

export type LaunchPhase = 1 | 2 | 3;

export type ProductTag =
  | "bestseller"
  | "new"
  | "spicy"
  | "chefs-pick"
  | "value"
  | "signature";

/* ------------------------------------------------------------------ */
/* Catalog                                                             */
/* ------------------------------------------------------------------ */

export interface Category {
  id: ID;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  /** lucide-react icon name, resolved at render time. */
  icon: string;
  order: number;
  availability: Availability;
  launchPhase: LaunchPhase;
  /** Copy shown on a locked card, e.g. "Landing 2026". */
  comingSoonNote?: string;
}

/** A single choice inside a variant or addon group. */
export interface Option {
  id: ID;
  name: string;
  /** Added to (or subtracted from) the product base price. */
  priceDelta: Money;
  description?: string;
  diet?: DietType;
  available: boolean;
  isDefault?: boolean;
  badge?: string;
}

/**
 * Single-select choice set that defines the item itself: size, crust, base.
 * Generic on purpose, so waffles can use Portion / Batter groups instead.
 */
export interface VariantGroup {
  id: ID;
  name: string;
  hint?: string;
  required: true;
  type: "single";
  /** `absolute` shows base + delta (e.g. "₹109") instead of "+₹40" — for size-priced menus. */
  priceMode?: "delta" | "absolute";
  options: Option[];
}

/** Multi-select extras: toppings, sauces, dips. */
export interface AddonGroup {
  id: ID;
  name: string;
  hint?: string;
  required: false;
  type: "multi";
  /** Upper bound on selections; omit for unlimited. */
  max?: number;
  options: Option[];
}

export interface NutritionFacts {
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Product {
  id: ID;
  slug: string;
  name: string;
  description: string;
  /** Editorial paragraph for the detail page. */
  longDescription?: string;
  ingredients: string[];
  images: string[];
  categoryId: ID;
  /** Price of the default configuration, before variant deltas. */
  basePrice: Money;
  /** Struck-through reference price when the item is discounted. */
  compareAtPrice?: Money;
  diet: DietType;
  tags: ProductTag[];
  variants: VariantGroup[];
  addons: AddonGroup[];
  availability: Availability;
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
  rating?: number;
  ratingCount?: number;
  serves?: string;
  prepTimeMins?: number;
  nutrition?: NutritionFacts;
  /** Restricts an item to given outlets; empty means every store. */
  availableStoreIds?: ID[];
}

/* ------------------------------------------------------------------ */
/* Stores                                                              */
/* ------------------------------------------------------------------ */

/** Times are 24h "HH:mm" in store-local time. */
export interface DayHours {
  open: string;
  close: string;
}

/** Index 0 is Sunday, matching Date.getDay(). A null entry closes the day. */
export type OpeningHours = (DayHours | null)[];

export type StoreStatus = "live" | "coming-soon" | "temporarily-closed";

export interface Store {
  id: ID;
  slug: string;
  name: string;
  /** Short label for the location pill, e.g. "Gomti Nagar". */
  locality: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email?: string;
  openingHours: OpeningHours;
  services: ServiceMode[];
  status: StoreStatus;
  deliveryRadiusKm: number;
  image?: string;
  /** Populated client-side once the browser reports a position. */
  distanceKm?: number;
}

/** Runtime open/closed answer derived from openingHours. */
export interface StoreOpenState {
  isOpen: boolean;
  label: string;
  /** e.g. "Opens 10:00 AM" or "Closes 1:00 AM". */
  nextChange?: string;
}

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */

/** A resolved selection, flattened so the cart never re-reads the catalog. */
export interface SelectedOption {
  groupId: ID;
  groupName: string;
  optionId: ID;
  optionName: string;
  priceDelta: Money;
}

export interface CartItem {
  /** Line id. The same product appears twice if configured differently. */
  id: ID;
  productId: ID;
  slug: string;
  name: string;
  image: string;
  diet: DietType;
  quantity: number;
  /** Base plus variant and addon deltas, for a single unit. */
  unitPrice: Money;
  variants: SelectedOption[];
  addons: SelectedOption[];
  note?: string;
}

export interface PriceBreakdown {
  subtotal: Money;
  packagingFee: Money;
  deliveryFee: Money;
  taxes: Money;
  discount: Money;
  total: Money;
}

export interface Cart {
  items: CartItem[];
  serviceMode: ServiceMode;
  storeId?: ID;
  addressId?: ID;
  couponCode?: string;
}

/* ------------------------------------------------------------------ */
/* Customers                                                           */
/* ------------------------------------------------------------------ */

export type AddressLabel = "home" | "work" | "other";

export interface Address {
  id: ID;
  label: AddressLabel;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  locality: string;
  city: string;
  pincode: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface User {
  id: ID;
  name: string;
  phone: string;
  email?: string;
  addresses: Address[];
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

export type OrderStatus =
  | "placed"
  | "preparing"
  | "baking"
  | "out-for-delivery"
  | "ready-for-pickup"
  | "delivered"
  | "cancelled";

/** Immutable snapshot. Prices must not shift if the catalog changes. */
export interface OrderItem {
  id: ID;
  productId: ID;
  name: string;
  image: string;
  diet: DietType;
  quantity: number;
  unitPrice: Money;
  variants: SelectedOption[];
  addons: SelectedOption[];
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  label: string;
  description: string;
  /** ISO timestamp; absent while the step is still pending. */
  at?: string;
}

export interface Order {
  id: ID;
  /** Human-readable reference shown to the customer. */
  code: string;
  items: OrderItem[];
  status: OrderStatus;
  serviceMode: ServiceMode;
  storeId: ID;
  address?: Address;
  pricing: PriceBreakdown;
  couponCode?: string;
  placedAt: string;
  etaMinutes: number;
  timeline: OrderTimelineEntry[];
  paymentId?: ID;
}

/* ------------------------------------------------------------------ */
/* Promotions                                                          */
/* ------------------------------------------------------------------ */

export type CouponType = "percent" | "flat" | "free-delivery";

export interface Coupon {
  code: string;
  type: CouponType;
  /** Percentage points for percent, rupees for flat, ignored otherwise. */
  value: number;
  description: string;
  minOrder: Money;
  maxDiscount?: Money;
  active: boolean;
  validTill?: string;
  /** Limits the coupon to given categories; empty means sitewide. */
  categoryIds?: ID[];
}

export interface Offer {
  id: ID;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  /** Large display string, e.g. "50% OFF". */
  discountLabel: string;
  badge?: string;
  couponCode?: string;
  /** Where the offer's CTA goes; defaults to the menu. */
  href?: string;
  terms: string[];
  validTill?: string;
  featured: boolean;
  order: number;
}

/* ------------------------------------------------------------------ */
/* Payments                                                            */
/* ------------------------------------------------------------------ */

export type PaymentProvider = "razorpay" | "stripe" | "upi" | "cod" | "card";

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded";

export interface PaymentMethodOption {
  id: PaymentProvider;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  /** Shown when enabled is false, e.g. "Gateway key required". */
  disabledReason?: string;
}

export interface Payment {
  id: ID;
  orderId: ID;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: Money;
  transactionRef?: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Social proof                                                        */
/* ------------------------------------------------------------------ */

export interface Review {
  id: ID;
  author: string;
  initials: string;
  rating: number;
  title?: string;
  body: string;
  city: string;
  date: string;
  verifiedOrder: boolean;
  productId?: ID;
  storeId?: ID;
  /** Where the review came from once a real source is wired up. */
  source: "placeholder" | "website" | "google" | "zomato" | "swiggy";
}

/* ------------------------------------------------------------------ */
/* Service-layer helpers                                               */
/* ------------------------------------------------------------------ */

export interface MenuFilters {
  categoryId?: ID;
  query?: string;
  diet?: DietType[];
  tags?: ProductTag[];
  maxPrice?: Money;
  sort?: "popular" | "price-asc" | "price-desc" | "new";
}

export interface StoreFilters {
  query?: string;
  city?: string;
  services?: ServiceMode[];
  openNow?: boolean;
  near?: Coordinates;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
