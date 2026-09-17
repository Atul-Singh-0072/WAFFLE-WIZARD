"use client";

import { useEffect, useState } from "react";
import { getCouponByCode } from "@/services/promotions";
import type { Coupon } from "@/types";

/** Resolves a coupon code to its record; undefined while loading or when invalid. */
export function useCoupon(code: string | undefined): Coupon | undefined {
  const [coupon, setCoupon] = useState<Coupon>();

  useEffect(() => {
    let alive = true;
    getCouponByCode(code ?? "").then((found) => {
      if (alive) setCoupon(found);
    });
    return () => {
      alive = false;
    };
  }, [code]);

  return coupon;
}
