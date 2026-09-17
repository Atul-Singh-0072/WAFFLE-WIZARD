"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { CartLine } from "@/components/cart/CartLine";
import { CartSummary } from "@/components/cart/CartSummary";
import { CouponInput } from "@/components/cart/CouponInput";
import { FreeDeliveryMeter } from "@/components/cart/FreeDeliveryMeter";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { useCoupon } from "@/hooks/use-coupon";
import { formatPrice } from "@/lib/utils/format";
import { computeBreakdown } from "@/services/pricing";
import { useCart } from "@/store/cart-store";
import { useLocation } from "@/store/location-store";

export function CartDrawer() {
  const cart = useCart();
  const { serviceMode } = useLocation();
  const router = useRouter();
  const coupon = useCoupon(cart.couponCode);

  const breakdown = computeBreakdown({ items: cart.items, serviceMode, coupon });
  const empty = cart.items.length === 0;

  const goToCheckout = () => {
    cart.close();
    router.push("/checkout");
  };

  return (
    <Drawer
      open={cart.isOpen}
      onClose={cart.close}
      title={
        <span className="inline-flex items-baseline gap-2">
          Your cart
          {cart.count > 0 && <span className="text-sm font-semibold text-muted tabular">({cart.count})</span>}
        </span>
      }
      footer={
        !empty && (
          <Button fullWidth size="lg" onClick={goToCheckout} iconRight={<ArrowRight className="size-4" />}>
            <span className="flex w-full items-center justify-between gap-4">
              <span>Proceed to checkout</span>
              <span className="tabular">{formatPrice(breakdown.total)}</span>
            </span>
          </Button>
        )
      }
    >
      {empty ? (
        <div className="flex h-full min-h-[50vh] flex-col items-center justify-center text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-primary-50 text-primary">
            <ShoppingBag className="size-9" strokeWidth={1.6} />
          </span>
          <h3 className="mt-5 font-display text-2xl font-bold text-text">Nothing in here yet</h3>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Start with a pizza — the cart remembers itself if you leave and come back.
          </p>
          <Button href="/menu" size="lg" className="mt-6" onClick={cart.close}>
            Browse the menu
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <FreeDeliveryMeter subtotal={breakdown.subtotal} serviceMode={serviceMode} />

          <ul className="divide-y divide-border">
            {cart.items.map((item) => (
              <CartLine key={item.id} item={item} />
            ))}
          </ul>

          <CouponInput subtotal={breakdown.subtotal} />

          <CartSummary breakdown={breakdown} serviceMode={serviceMode} />
        </div>
      )}
    </Drawer>
  );
}
