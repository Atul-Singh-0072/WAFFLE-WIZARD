"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { getIcon } from "@/lib/utils/icons";
import { getPaymentMethods } from "@/services/payments";
import type { PaymentMethodOption, PaymentProvider } from "@/types";

interface PaymentStepProps {
  value: PaymentProvider;
  onChange: (provider: PaymentProvider) => void;
  total: number;
}

export function PaymentStep({ value, onChange, total }: PaymentStepProps) {
  const [methods, setMethods] = useState<PaymentMethodOption[]>([]);

  useEffect(() => {
    getPaymentMethods().then(setMethods);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-text">How would you like to pay?</h2>
        <p className="mt-1 text-sm text-muted">
          You will pay <span className="font-bold text-text tabular">{formatPrice(total)}</span>. Online methods switch on as gateways are connected.
        </p>
      </div>

      <div className="grid gap-2" role="radiogroup" aria-label="Payment method">
        {methods.map((method) => {
          const Icon = getIcon(method.icon);
          const selected = value === method.id;
          return (
            <label
              key={method.id}
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-xl border-[1.5px] p-4 transition-colors",
                selected ? "border-primary bg-primary-50/60" : "border-border bg-surface hover:border-primary-200",
                !method.enabled && "cursor-not-allowed opacity-55",
              )}
            >
              <input type="radio" name="payment" value={method.id} checked={selected} disabled={!method.enabled} onChange={() => onChange(method.id)} className="peer sr-only" />
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-primary peer-focus-visible:ring-4 peer-focus-visible:ring-secondary-300/70">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-text">{method.name}</span>
                <span className="block text-xs text-muted">{method.enabled ? method.description : method.disabledReason}</span>
              </span>
              <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px]", selected ? "border-primary bg-primary text-white" : "border-border text-transparent")} aria-hidden>
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            </label>
          );
        })}
      </div>

      <p className="text-xs leading-relaxed text-muted">
        By placing this order you agree to our terms and refund policy. A confirmation with your order code will appear on the next screen.
      </p>
    </div>
  );
}
