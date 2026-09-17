"use client";

import { ChevronRight, MapPin } from "lucide-react";
import { useState } from "react";
import { LocationSheet } from "@/components/layout/LocationSheet";
import { StoreStatusPill } from "@/components/stores/StoreStatusPill";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Field";
import { serviceModes } from "@/data/content";
import { cn } from "@/lib/utils/cn";
import { formatDistance, serviceModeLabels } from "@/lib/utils/format";
import { getIcon } from "@/lib/utils/icons";
import { useLocation } from "@/store/location-store";

export interface ContactForm {
  name: string;
  phone: string;
  email: string;
}

export function validateContact(form: ContactForm): Record<string, string> {
  const errors: Record<string, string> = {};
  if (form.name.trim().length < 2) errors.name = "Enter your name.";
  if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) errors.phone = "Enter a valid 10-digit mobile number.";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "That email does not look right.";
  return errors;
}

interface DetailsStepProps {
  contact: ContactForm;
  onChange: (next: ContactForm) => void;
  errors: Record<string, string>;
}

export function DetailsStep({ contact, onChange, errors }: DetailsStepProps) {
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-lg font-bold text-text">How are you getting it?</h2>
        <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Service type">
          {serviceModes.map((m) => {
            const Icon = getIcon(m.icon);
            return (
              <Chip key={m.mode} selected={location.serviceMode === m.mode} onClick={() => location.setServiceMode(m.mode)} icon={<Icon className="size-4" />} className="h-12 justify-center px-2 text-[13px]">
                {m.title}
              </Chip>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold text-text">Outlet</h2>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className={cn(
            "mt-3 flex w-full items-center gap-3 rounded-xl border-[1.5px] p-4 text-left transition-colors hover:border-primary-300",
            errors.store ? "border-danger bg-red-50/40" : "border-border bg-surface",
          )}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
            <MapPin className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            {location.store ? (
              <>
                <span className="block font-semibold text-text">{location.store.name}</span>
                <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                  <StoreStatusPill store={location.store} size="xs" />
                  <span>{serviceModeLabels[location.serviceMode]}</span>
                  {typeof location.distanceKm === "number" && <span>· {formatDistance(location.distanceKm)} away</span>}
                </span>
              </>
            ) : (
              <>
                <span className="block font-semibold text-text">Choose an outlet</span>
                <span className="block text-xs text-muted">Search your area or pick from the list</span>
              </>
            )}
          </span>
          <ChevronRight className="size-5 shrink-0 text-muted" />
        </button>
        {errors.store && (
          <p className="mt-2 text-xs font-medium text-danger" role="alert">
            {errors.store}
          </p>
        )}
        <LocationSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
      </section>

      <section>
        <h2 className="font-display text-lg font-bold text-text">Contact details</h2>
        <p className="mt-1 text-sm text-muted">We use these to reach you about this order only.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Full name" value={contact.name} onChange={(e) => onChange({ ...contact, name: e.target.value })} autoComplete="name" required error={errors.name} />
          <Input label="Mobile number" type="tel" inputMode="numeric" value={contact.phone} onChange={(e) => onChange({ ...contact, phone: e.target.value })} autoComplete="tel-national" placeholder="10-digit number" required error={errors.phone} />
          <Input label="Email" type="email" value={contact.email} onChange={(e) => onChange({ ...contact, email: e.target.value })} autoComplete="email" hint="Optional — for your receipt" error={errors.email} wrapperClassName="sm:col-span-2" />
        </div>
      </section>
    </div>
  );
}
