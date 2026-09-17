"use client";

import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { CartLine } from "@/components/cart/CartLine";
import { CartSummary } from "@/components/cart/CartSummary";
import { CouponInput } from "@/components/cart/CouponInput";
import { FreeDeliveryMeter } from "@/components/cart/FreeDeliveryMeter";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCoupon } from "@/hooks/use-coupon";
import { serviceModeLabels } from "@/lib/utils/format";
import { computeBreakdown } from "@/services/pricing";
import { useCart } from "@/store/cart-store";
import { useLocation } from "@/store/location-store";

export function CartPage() {
  const cart = useCart();
  const location = useLocation();
  const coupon = useCoupon(cart.couponCode);

  const breakdown = computeBreakdown({ items: cart.items, serviceMode: location.serviceMode, coupon });

  if (!cart.hydrated) {
    return (
      <div className="container-page section-y">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-6 h-40 w-full" />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-primary-50 text-primary">
          <ShoppingBag className="size-9" strokeWidth={1.6} />
        </span>
        <h1 className="display-md mt-6 text-text">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-muted">Nothing here yet. The menu is one tap away.</p>
        <Button href="/menu" size="lg" className="mt-8" iconRight={<ArrowRight className="size-4" />}>
          Browse the menu
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Cart"
        title={`${cart.count} ${cart.count === 1 ? "item" : "items"}, ready when you are`}
        description={
          location.store
            ? `${serviceModeLabels[location.serviceMode]} from ${location.store.locality}. Change it at checkout if needed.`
            : "You will choose an outlet and service type at checkout."
        }
        crumbs={[{ label: "Cart" }]}
      />

      <div className="container-page grid gap-8 pb-16 pt-8 lg:grid-cols-12 lg:gap-12">
        <section className="lg:col-span-7" aria-label="Items in your cart">
          <ul className="divide-y divide-border rounded-2xl border border-border bg-surface px-5">
            {cart.items.map((item) => (
              <CartLine key={item.id} item={item} />
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between">
            <Button href="/menu" variant="ghost" iconLeft={<ArrowLeft className="size-4" />}>
              Add more items
            </Button>
            <button type="button" onClick={cart.clear} className="text-sm font-semibold text-muted hover:text-danger">
              Clear cart
            </button>
          </div>
        </section>

        <aside className="lg:col-span-5">
          <div className="space-y-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <FreeDeliveryMeter subtotal={breakdown.subtotal} serviceMode={location.serviceMode} />
            <CouponInput subtotal={breakdown.subtotal} />
            <CartSummary breakdown={breakdown} serviceMode={location.serviceMode} />
            <Button href="/checkout" fullWidth size="xl" iconRight={<ArrowRight className="size-5" />}>
              Proceed to checkout
            </Button>
            <p className="text-center text-xs text-muted">Prices include all applicable taxes. Delivery fee shown is per order.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
