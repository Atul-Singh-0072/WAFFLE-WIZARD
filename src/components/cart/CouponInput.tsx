"use client";

import { Check, Ticket, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useCoupon } from "@/hooks/use-coupon";
import { applyCoupon } from "@/services/pricing";
import { getCouponByCode, getSuggestedCoupons } from "@/services/promotions";
import { useCart } from "@/store/cart-store";
import type { Coupon } from "@/types";

export function CouponInput({ subtotal }: { subtotal: number }) {
  const cart = useCart();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  const applied = useCoupon(cart.couponCode);
  const [suggested, setSuggested] = useState<Coupon[]>([]);

  useEffect(() => {
    let alive = true;
    getSuggestedCoupons(3).then((list) => {
      if (alive) setSuggested(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  const tryApply = async (code: string) => {
    setError(undefined);
    const coupon = await getCouponByCode(code);
    const outcome = applyCoupon(coupon, subtotal);
    if (!outcome.ok) {
      setError(outcome.reason);
      return;
    }
    cart.setCoupon(outcome.coupon.code);
    setValue("");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (value.trim()) tryApply(value);
  };

  if (applied) {
    const outcome = applyCoupon(applied, subtotal);
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-success text-white">
            <Check className="size-4" strokeWidth={3} />
          </span>
          <div>
            <p className="text-sm font-bold text-emerald-900">{applied.code} applied</p>
            <p className="text-xs text-emerald-800">
              {outcome.ok ? applied.description : outcome.reason}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => cart.setCoupon(undefined)}
          aria-label="Remove coupon"
          className="flex size-8 items-center justify-center rounded-full text-emerald-800 hover:bg-emerald-100"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="relative">
        <label htmlFor="coupon" className="sr-only">
          Promo code
        </label>
        <Ticket className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
          id="coupon"
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          placeholder="Promo code"
          autoComplete="off"
          autoCapitalize="characters"
          className="h-12 w-full rounded-xl border-[1.5px] border-border bg-surface pl-11 pr-24 text-sm font-semibold uppercase tracking-wide text-text placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-muted/80 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
        />
        <Button type="submit" size="sm" variant="secondary" className="absolute right-1.5 top-1/2 -translate-y-1/2" disabled={!value.trim()}>
          Apply
        </Button>
      </form>
      {error && (
        <p className="mt-2 text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
      {suggested.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {suggested.map((coupon) => (
            <button
              key={coupon.code}
              type="button"
              onClick={() => tryApply(coupon.code)}
              className="rounded-full border border-dashed border-primary-300 bg-primary-50/60 px-3 py-1 text-[11px] font-bold tracking-wide text-primary-800 hover:bg-primary-100"
              title={coupon.description}
            >
              {coupon.code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
