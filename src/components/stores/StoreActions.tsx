"use client";

import { ArrowRight, Navigation, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { isPlaceholder } from "@/lib/config/site";
import { directionsUrl } from "@/lib/utils/geo";
import { useLocation } from "@/store/location-store";
import type { Store } from "@/types";

/** Primary actions for a store page. Selecting the outlet then jumps to the menu. */
export function StoreActions({ store }: { store: Store }) {
  const location = useLocation();
  const router = useRouter();
  const live = store.status === "live";

  const orderHere = async () => {
    await location.selectStore(store.id);
    router.push("/menu");
  };

  return (
    <div className="flex flex-wrap gap-2 lg:justify-end">
      {live ? (
        <Button size="lg" onClick={orderHere} iconRight={<ArrowRight className="size-4" />}>
          Order from this store
        </Button>
      ) : (
        <Button size="lg" variant="gold" href="#newsletter">
          Get notified when it opens
        </Button>
      )}
      {!isPlaceholder(store.phone) && (
        <Button size="lg" variant="light" href={`tel:${store.phone}`} iconLeft={<Phone className="size-4" />}>
          Call
        </Button>
      )}
      <Button size="lg" variant="light" href={directionsUrl(store)} target="_blank" rel="noopener noreferrer" iconLeft={<Navigation className="size-4" />}>
        Directions
      </Button>
    </div>
  );
}
