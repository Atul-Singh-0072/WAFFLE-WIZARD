"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import type { AddressForm } from "@/components/checkout/steps/AddressStep";
import type { ContactForm } from "@/components/checkout/steps/DetailsStep";
import { DietBadge } from "@/components/ui/DietBadge";
import { BLUR_DATA_URL } from "@/data/media";
import { formatPrice, serviceModeLabels } from "@/lib/utils/format";
import type { CartItem, ServiceMode, Store } from "@/types";

interface ReviewStepProps {
  items: CartItem[];
  serviceMode: ServiceMode;
  store?: Store;
  address: AddressForm;
  contact: ContactForm;
  onEdit: (step: number) => void;
}

const arrivalLabel: Record<AddressForm["arrival"], string> = {
  asap: "as soon as it is ready",
  "30": "in about 30 minutes",
  "60": "in about an hour",
};

function Block({ title, step, onEdit, children }: { title: string; step: number; onEdit: (s: number) => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{title}</h3>
        <button type="button" onClick={() => onEdit(step)} className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:underline">
          <Pencil className="size-3" /> Edit
        </button>
      </div>
      <div className="mt-2 text-sm text-text">{children}</div>
    </div>
  );
}

export function ReviewStep({ items, serviceMode, store, address, contact, onEdit }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-text">Everything look right?</h2>
        <p className="mt-1 text-sm text-muted">You can still change any of this before paying.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Block title={`${serviceModeLabels[serviceMode]} from`} step={0} onEdit={onEdit}>
          <p className="font-semibold">{store?.name ?? "No outlet selected"}</p>
          {store && <p className="text-muted">{store.locality}, {store.city}</p>}
        </Block>
        <Block title="Contact" step={0} onEdit={onEdit}>
          <p className="font-semibold">{contact.name}</p>
          <p className="text-muted">{contact.phone}{contact.email ? ` · ${contact.email}` : ""}</p>
        </Block>
        {serviceMode === "delivery" ? (
          <Block title={`Deliver to (${address.label})`} step={1} onEdit={onEdit}>
            <p>
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ""}
            </p>
            <p className="text-muted">
              {address.locality}, {address.city} {address.pincode}
              {address.landmark ? ` · ${address.landmark}` : ""}
            </p>
          </Block>
        ) : (
          <Block title="Timing" step={1} onEdit={onEdit}>
            <p>
              {serviceMode === "dine-in" ? "Arriving" : "Collecting"} {arrivalLabel[address.arrival]}
              {serviceMode === "dine-in" && ` · ${address.guests} ${address.guests === "1" ? "guest" : "guests"}`}
            </p>
          </Block>
        )}
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Items</h3>
        <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 p-3">
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
      </div>
    </div>
  );
}
