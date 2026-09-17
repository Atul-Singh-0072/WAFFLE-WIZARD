import { siteConfig } from "@/lib/config/site";
import type {
  CartItem,
  Coupon,
  Money,
  PriceBreakdown,
  Product,
  SelectedOption,
  ServiceMode,
} from "@/types";

/**
 * Pure pricing math. No I/O, no React — safe to call on server or client and
 * trivially unit-testable. When a backend owns pricing, keep this file as the
 * optimistic client-side preview and treat the server total as authoritative.
 */

/* ------------------------------------------------------------------ */
/* Line pricing                                                        */
/* ------------------------------------------------------------------ */

export function unitPrice(
  product: Product,
  variants: SelectedOption[],
  addons: SelectedOption[],
): Money {
  const variantTotal = variants.reduce((sum, v) => sum + v.priceDelta, 0);
  const addonTotal = addons.reduce((sum, a) => sum + a.priceDelta, 0);
  return product.basePrice + variantTotal + addonTotal;
}

export function lineTotal(item: CartItem): Money {
  return item.unitPrice * item.quantity;
}

export function cartSubtotal(items: CartItem[]): Money {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/* ------------------------------------------------------------------ */
/* Coupons                                                             */
/* ------------------------------------------------------------------ */

export type CouponOutcome =
  | { ok: true; discount: Money; freeDelivery: boolean; coupon: Coupon }
  | { ok: false; reason: string };

export function applyCoupon(coupon: Coupon | undefined, subtotal: Money): CouponOutcome {
  if (!coupon) return { ok: false, reason: "That code is not valid." };
  if (!coupon.active) return { ok: false, reason: "That code has expired." };
  if (coupon.validTill && new Date(coupon.validTill) < new Date()) {
    return { ok: false, reason: "That code has expired." };
  }
  if (subtotal < coupon.minOrder) {
    return {
      ok: false,
      reason: `Add ${siteConfig.currencySymbol}${coupon.minOrder - subtotal} more to use ${coupon.code}.`,
    };
  }

  switch (coupon.type) {
    case "percent": {
      const raw = Math.round((subtotal * coupon.value) / 100);
      const capped = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
      return { ok: true, discount: capped, freeDelivery: false, coupon };
    }
    case "flat":
      return { ok: true, discount: Math.min(coupon.value, subtotal), freeDelivery: false, coupon };
    case "free-delivery":
      return { ok: true, discount: 0, freeDelivery: true, coupon };
  }
}

/* ------------------------------------------------------------------ */
/* Order breakdown                                                     */
/* ------------------------------------------------------------------ */

export interface BreakdownInput {
  items: CartItem[];
  serviceMode: ServiceMode;
  coupon?: Coupon;
}

export function computeBreakdown({ items, serviceMode, coupon }: BreakdownInput): PriceBreakdown {
  const { packagingFee, deliveryFee, freeDeliveryAbove, taxRate } = siteConfig.pricing;

  const subtotal = cartSubtotal(items);
  if (subtotal === 0) {
    return { subtotal: 0, packagingFee: 0, deliveryFee: 0, taxes: 0, discount: 0, total: 0 };
  }

  const outcome = applyCoupon(coupon, subtotal);
  const discount = outcome.ok ? outcome.discount : 0;
  const couponWaivesDelivery = outcome.ok && outcome.freeDelivery;

  const packaging = serviceMode === "dine-in" ? 0 : packagingFee;
  const delivery =
    serviceMode !== "delivery" || subtotal >= freeDeliveryAbove || couponWaivesDelivery
      ? 0
      : deliveryFee;

  const taxable = Math.max(subtotal - discount, 0);
  const taxes = Math.round(taxable * taxRate);
  const total = taxable + packaging + delivery + taxes;

  return { subtotal, packagingFee: packaging, deliveryFee: delivery, taxes, discount, total };
}

/** Amount still needed to unlock free delivery, or 0 when already unlocked. */
export function amountToFreeDelivery(subtotal: Money): Money {
  return Math.max(siteConfig.pricing.freeDeliveryAbove - subtotal, 0);
}
