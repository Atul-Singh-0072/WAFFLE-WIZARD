"use client";

import { Briefcase, Home, MapPinned } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { Input, Select } from "@/components/ui/Field";
import { siteConfig } from "@/lib/config/site";
import type { AddressLabel, ServiceMode } from "@/types";

export interface AddressForm {
  label: AddressLabel;
  line1: string;
  line2: string;
  locality: string;
  city: string;
  pincode: string;
  landmark: string;
  /** Pickup / dine-in only. */
  arrival: "asap" | "30" | "60";
  guests: string;
}

export const emptyAddress: AddressForm = {
  label: "home",
  line1: "",
  line2: "",
  locality: "",
  city: siteConfig.defaultCity,
  pincode: "",
  landmark: "",
  arrival: "asap",
  guests: "2",
};

export function validateAddress(form: AddressForm): Record<string, string> {
  const errors: Record<string, string> = {};
  if (form.line1.trim().length < 4) errors.line1 = "Enter your house / flat and street.";
  if (form.locality.trim().length < 2) errors.locality = "Enter your locality.";
  if (!/^\d{6}$/.test(form.pincode)) errors.pincode = "Enter a 6-digit pincode.";
  return errors;
}

const labels: { value: AddressLabel; label: string; icon: typeof Home }[] = [
  { value: "home", label: "Home", icon: Home },
  { value: "work", label: "Work", icon: Briefcase },
  { value: "other", label: "Other", icon: MapPinned },
];

interface AddressStepProps {
  address: AddressForm;
  onChange: (next: AddressForm) => void;
  errors: Record<string, string>;
  serviceMode: ServiceMode;
  storeLocality?: string;
}

export function AddressStep({ address, onChange, errors, serviceMode, storeLocality }: AddressStepProps) {
  if (serviceMode !== "delivery") {
    const dineIn = serviceMode === "dine-in";
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-lg font-bold text-text">{dineIn ? "When are you arriving?" : "When will you collect?"}</h2>
          <p className="mt-1 text-sm text-muted">
            {dineIn
              ? `We will hold a table at ${storeLocality ?? "the outlet"} and start cooking as you arrive.`
              : `Your order will be boxed and waiting at ${storeLocality ?? "the outlet"} counter.`}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Arrival" value={address.arrival} onChange={(e) => onChange({ ...address, arrival: e.target.value as AddressForm["arrival"] })}>
            <option value="asap">As soon as it is ready</option>
            <option value="30">In about 30 minutes</option>
            <option value="60">In about an hour</option>
          </Select>
          {dineIn && (
            <Select label="Guests" value={address.guests} onChange={(e) => onChange({ ...address, guests: e.target.value })}>
              {["1", "2", "3", "4", "5", "6", "7", "8"].map((n) => (
                <option key={n} value={n}>
                  {n} {n === "1" ? "guest" : "guests"}
                </option>
              ))}
            </Select>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-text">Where should we deliver?</h2>
        <p className="mt-1 text-sm text-muted">Delivering from {storeLocality ?? "your selected outlet"}.</p>
      </div>

      <div className="flex gap-2" role="group" aria-label="Address label">
        {labels.map(({ value, label, icon: Icon }) => (
          <Chip key={value} selected={address.label === value} onClick={() => onChange({ ...address, label: value })} icon={<Icon className="size-4" />}>
            {label}
          </Chip>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="House / flat, building, street" value={address.line1} onChange={(e) => onChange({ ...address, line1: e.target.value })} autoComplete="address-line1" required error={errors.line1} wrapperClassName="sm:col-span-2" />
        <Input label="Area / sector" value={address.line2} onChange={(e) => onChange({ ...address, line2: e.target.value })} autoComplete="address-line2" wrapperClassName="sm:col-span-2" />
        <Input label="Locality" value={address.locality} onChange={(e) => onChange({ ...address, locality: e.target.value })} autoComplete="address-level3" required error={errors.locality} />
        <Input label="Pincode" inputMode="numeric" maxLength={6} value={address.pincode} onChange={(e) => onChange({ ...address, pincode: e.target.value.replace(/\D/g, "") })} autoComplete="postal-code" required error={errors.pincode} />
        <Input label="City" value={address.city} onChange={(e) => onChange({ ...address, city: e.target.value })} autoComplete="address-level2" />
        <Input label="Landmark" value={address.landmark} onChange={(e) => onChange({ ...address, landmark: e.target.value })} hint="Helps the rider find you faster" />
      </div>
    </div>
  );
}
