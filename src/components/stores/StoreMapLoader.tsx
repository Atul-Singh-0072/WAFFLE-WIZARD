"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { ComponentProps } from "react";

/** Leaflet touches `window` at import time, so the map is client-only. */
const StoreMap = dynamic(() => import("@/components/stores/StoreMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-2 text-muted" role="status" aria-label="Loading map">
      <MapPin className="size-6 animate-bounce text-primary" />
    </div>
  ),
});

export function StoreMapLoader(props: ComponentProps<typeof StoreMap>) {
  return <StoreMap {...props} />;
}
