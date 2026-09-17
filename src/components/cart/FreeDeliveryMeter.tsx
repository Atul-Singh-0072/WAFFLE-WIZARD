import { Bike } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { formatPrice } from "@/lib/utils/format";
import { amountToFreeDelivery } from "@/services/pricing";
import type { ServiceMode } from "@/types";

export function FreeDeliveryMeter({ subtotal, serviceMode }: { subtotal: number; serviceMode: ServiceMode }) {
  if (serviceMode !== "delivery") return null;

  const remaining = amountToFreeDelivery(subtotal);
  const progress = Math.min(subtotal / siteConfig.pricing.freeDeliveryAbove, 1);

  return (
    <div className="rounded-xl bg-primary-50/70 px-4 py-3">
      <div className="flex items-center gap-2.5 text-sm">
        <Bike className="size-4 shrink-0 text-primary" />
        <p className="font-medium text-primary-900">
          {remaining > 0 ? (
            <>
              Add <span className="font-bold tabular">{formatPrice(remaining)}</span> more for free delivery
            </>
          ) : (
            <>You have unlocked free delivery</>
          )}
        </p>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-primary-100" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}
