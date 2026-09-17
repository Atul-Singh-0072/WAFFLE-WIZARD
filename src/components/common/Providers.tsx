"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { CartProvider } from "@/store/cart-store";
import { LocationProvider } from "@/store/location-store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LocationProvider>
        <CartProvider>{children}</CartProvider>
      </LocationProvider>
    </MotionConfig>
  );
}
