"use client";

import { ArrowLeft, ArrowRight, Lock, MapPin, ShieldCheck, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CartSummary } from "@/components/cart/CartSummary";
import { CouponInput } from "@/components/cart/CouponInput";
import { AddressStep, type AddressForm, emptyAddress, validateAddress } from "@/components/checkout/steps/AddressStep";
import { DetailsStep, type ContactForm, validateContact } from "@/components/checkout/steps/DetailsStep";
import { PaymentStep } from "@/components/checkout/steps/PaymentStep";
import { ReviewStep } from "@/components/checkout/steps/ReviewStep";
import { Stepper, type Step } from "@/components/checkout/Stepper";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCoupon } from "@/hooks/use-coupon";
import { formatPrice } from "@/lib/utils/format";
import { createOrder } from "@/services/orders";
import { initiatePayment } from "@/services/payments";
import { computeBreakdown } from "@/services/pricing";
import { useCart } from "@/store/cart-store";
import { useLocation } from "@/store/location-store";
import type { Address, PaymentProvider } from "@/types";

const STEPS: Step[] = [
  { id: "details", label: "Outlet" },
  { id: "address", label: "Address" },
  { id: "review", label: "Review" },
  { id: "payment", label: "Payment" },
];

const STEP_TITLES = ["Outlet & contact", "Address & timing", "Review your order", "Payment"];

export function CheckoutFlow() {
  const cart = useCart();
  const location = useLocation();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [contact, setContact] = useState<ContactForm>({ name: "", phone: "", email: "" });
  const [address, setAddress] = useState<AddressForm>(emptyAddress);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [provider, setProvider] = useState<PaymentProvider>("cod");
  const coupon = useCoupon(cart.couponCode);
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string>();

  const breakdown = useMemo(
    () => computeBreakdown({ items: cart.items, serviceMode: location.serviceMode, coupon }),
    [cart.items, location.serviceMode, coupon],
  );

  const addressNeeded = location.serviceMode === "delivery";

  const next = () => {
    setPlaceError(undefined);
    if (step === 0) {
      const e = validateContact(contact);
      if (!location.store) e.store = "Choose an outlet to continue.";
      if (location.serviceMode === "delivery" && location.delivers === false) e.store = "This outlet does not deliver to your area. Pick another outlet or switch to pickup.";
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    if (step === 1 && addressNeeded) {
      const e = validateAddress(address);
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const placeOrder = async () => {
    if (!location.store) return;
    setPlacing(true);
    setPlaceError(undefined);
    try {
      const orderId = `ord_${Date.now().toString(36)}`;
      const payment = await initiatePayment(provider, {
        amount: breakdown.total,
        orderId,
        customer: { name: contact.name, phone: contact.phone, email: contact.email || undefined },
      });

      const deliveryAddress: Address | undefined = addressNeeded
        ? {
            id: `addr_${Date.now().toString(36)}`,
            label: address.label,
            fullName: contact.name,
            phone: contact.phone,
            line1: address.line1,
            line2: address.line2 || undefined,
            locality: address.locality,
            city: address.city,
            pincode: address.pincode,
            landmark: address.landmark || undefined,
            isDefault: true,
          }
        : undefined;

      const order = await createOrder({
        items: cart.items,
        serviceMode: location.serviceMode,
        storeId: location.store.id,
        address: deliveryAddress,
        pricing: breakdown,
        couponCode: coupon?.code,
        paymentId: payment.id,
      });

      cart.clear();
      router.push(`/track/${order.code}?placed=1`);
    } catch (error) {
      setPlaceError(error instanceof Error ? error.message : "Something went wrong placing your order.");
      setPlacing(false);
    }
  };

  if (!cart.hydrated || !location.hydrated) {
    return (
      <div className="container-page section-y">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-8 h-64 w-full" />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-primary-50 text-primary">
          <ShoppingBag className="size-9" strokeWidth={1.6} />
        </span>
        <h1 className="display-md mt-6 text-text">Nothing to check out yet</h1>
        <p className="mt-2 max-w-sm text-muted">Add something from the menu and come back.</p>
        <Button href="/menu" size="lg" className="mt-8" iconRight={<ArrowRight className="size-4" />}>
          Browse the menu
        </Button>
      </div>
    );
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div className="bg-surface-2/40">
      <div className="container-page py-8 md:py-12">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-accent">Checkout</p>
            <h1 className="display-md mt-2 text-text">{STEP_TITLES[step]}</h1>
          </div>
          <div className="md:w-[28rem]">
            <Stepper steps={STEPS} current={step} onJump={setStep} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-7">
              {step === 0 && <DetailsStep contact={contact} onChange={setContact} errors={errors} />}
              {step === 1 && (
                <AddressStep
                  address={address}
                  onChange={setAddress}
                  errors={errors}
                  serviceMode={location.serviceMode}
                  storeLocality={location.store?.locality}
                />
              )}
              {step === 2 && <ReviewStep items={cart.items} serviceMode={location.serviceMode} store={location.store} address={address} contact={contact} onEdit={setStep} />}
              {step === 3 && <PaymentStep value={provider} onChange={setProvider} total={breakdown.total} />}

              {placeError && (
                <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
                  {placeError}
                </p>
              )}

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
                <Button variant="ghost" onClick={back} disabled={step === 0} iconLeft={<ArrowLeft className="size-4" />}>
                  Back
                </Button>
                {isLast ? (
                  <Button size="lg" onClick={placeOrder} loading={placing} iconLeft={<Lock className="size-4" />}>
                    Place order · {formatPrice(breakdown.total)}
                  </Button>
                ) : (
                  <Button size="lg" onClick={next} iconRight={<ArrowRight className="size-4" />}>
                    Continue
                  </Button>
                )}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="space-y-4 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-text">Order summary</h2>
                  <span className="text-xs font-semibold text-muted tabular">{cart.count} items</span>
                </div>
                <ul className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1 text-sm">
                  {cart.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3">
                      <span className="min-w-0 truncate text-text-soft">
                        <span className="font-semibold text-text tabular">{item.quantity}×</span> {item.name}
                      </span>
                      <span className="shrink-0 font-semibold tabular">{formatPrice(item.unitPrice * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <CouponInput subtotal={breakdown.subtotal} />
                </div>
                <CartSummary breakdown={breakdown} serviceMode={location.serviceMode} className="mt-4" />
              </div>

              {location.store && (
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-sm">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-text">{location.store.name}</p>
                    <p className="text-muted">
                      {location.store.locality}, {location.store.city} · {location.serviceMode}
                    </p>
                  </div>
                </div>
              )}

              <p className="flex items-center justify-center gap-2 text-xs text-muted">
                <ShieldCheck className="size-4 text-success" /> Your details are used only to fulfil this order.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
