"use client";

import { ArrowRight, Copy, Check, MapPin, PartyPopper, Phone, Receipt } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CartSummary } from "@/components/cart/CartSummary";
import { OrderProgress } from "@/components/orders/OrderProgress";
import { Button } from "@/components/ui/Button";
import { DietBadge } from "@/components/ui/DietBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { BLUR_DATA_URL } from "@/data/media";
import { isPlaceholder } from "@/lib/config/site";
import { formatDateTime, formatPrice, formatStoreAddress, orderStatusLabels, serviceModeLabels } from "@/lib/utils/format";
import { deriveStatus, getOrderByCode } from "@/services/orders";
import { getStoreById } from "@/services/stores";
import type { Order, OrderStatus, Store } from "@/types";

export function OrderTracker({ code }: { code: string }) {
  const params = useSearchParams();
  const justPlaced = params.get("placed") === "1";
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [store, setStore] = useState<Store>();
  const [status, setStatus] = useState<OrderStatus>("placed");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrderByCode(code).then(async (found) => {
      if (cancelled) return;
      setOrder(found ?? null);
      if (found) {
        setStatus(deriveStatus(found));
        setStore(await getStoreById(found.storeId));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  // Advance the simulated status without a reload.
  useEffect(() => {
    if (!order) return;
    const id = window.setInterval(() => setStatus(deriveStatus(order)), 15_000);
    return () => window.clearInterval(id);
  }, [order]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable; code is visible on screen.
    }
  };

  if (order === undefined) {
    return (
      <div className="container-page section-y">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-32 w-full" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow text-accent">Not found</p>
        <h1 className="display-md mt-2 text-text">We could not find order {code}</h1>
        <p className="mt-3 max-w-md text-muted">Check the code on your confirmation screen. Orders are stored on the device they were placed from.</p>
        <Button href="/track" variant="outline" className="mt-6">
          Try another code
        </Button>
      </div>
    );
  }

  const delivered = status === "delivered";

  return (
    <div className="container-page pb-16 pt-8">
      {justPlaced && (
        <div className="mb-8 flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 md:items-center" role="status">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success text-white">
            <PartyPopper className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-bold text-emerald-900">Order placed. The kitchen has it.</p>
            <p className="mt-0.5 text-sm text-emerald-800">Keep this code handy — it is how you track and reference the order.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-accent">{delivered ? "Delivered" : "Live status"}</p>
          <h1 className="display-md mt-2 flex flex-wrap items-center gap-3 text-text">
            <span>{orderStatusLabels[status]}</span>
            <button type="button" onClick={copyCode} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3 font-sans text-sm font-bold tracking-wider text-primary-800 hover:bg-primary-50" aria-label={`Copy order code ${order.code}`}>
              {order.code}
              {copied ? <Check className="size-3.5 text-success" strokeWidth={3} /> : <Copy className="size-3.5" />}
            </button>
          </h1>
          <p className="mt-2 text-sm text-muted">
            Placed {formatDateTime(order.placedAt)} · {serviceModeLabels[order.serviceMode]}
            {!delivered && ` · Estimated ${order.etaMinutes} min`}
          </p>
        </div>
        <Button href="/menu" variant="outline" iconRight={<ArrowRight className="size-4" />}>
          Order again
        </Button>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-8">
        <OrderProgress timeline={order.timeline} current={status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7" aria-labelledby="items-heading">
          <h2 id="items-heading" className="flex items-center gap-2 font-display text-lg font-bold text-text">
            <Receipt className="size-5 text-primary" /> Items
          </h2>
          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-surface">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 p-4">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                  <Image src={item.image} alt="" fill sizes="56px" className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <DietBadge diet={item.diet} />
                    <span className="truncate text-sm font-semibold text-text">{item.name}</span>
                    <span className="text-xs font-bold text-muted tabular">×{item.quantity}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted">
                    {[...item.variants.map((v) => v.optionName), ...item.addons.map((a) => `+${a.optionName}`)].join(" · ")}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-bold tabular">{formatPrice(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-4 lg:col-span-5">
          <CartSummary breakdown={order.pricing} serviceMode={order.serviceMode} />
          {store && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="flex items-center gap-2 font-display text-base font-bold text-text">
                <MapPin className="size-4 text-primary" /> {store.name}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {formatStoreAddress(store)}
              </p>
              {order.address && (
                <p className="mt-3 text-sm text-text-soft">
                  <span className="font-semibold text-text">Delivering to:</span> {order.address.line1}, {order.address.locality}, {order.address.pincode}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                {!isPlaceholder(store.phone) && (
                  <Button href={`tel:${store.phone}`} size="sm" variant="outline" iconLeft={<Phone className="size-4" />}>
                    Call outlet
                  </Button>
                )}
                <Button href={`/stores/${store.slug}`} size="sm" variant="ghost">
                  Store details
                </Button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
