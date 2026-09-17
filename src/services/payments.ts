import { paymentMethods } from "@/data/content";
import type { Money, Payment, PaymentMethodOption, PaymentProvider } from "@/types";

/**
 * Payment gateway seam.
 *
 * Each provider implements `PaymentAdapter`. The checkout page only ever calls
 * `initiatePayment`, so wiring Razorpay or Stripe means adding an adapter and
 * flipping `enabled` in src/data/content.ts — the UI does not change.
 */

export interface PaymentIntentInput {
  amount: Money;
  orderId: string;
  customer: { name: string; phone: string; email?: string };
}

export interface PaymentAdapter {
  provider: PaymentProvider;
  /** Resolve with a captured/authorized payment, or reject with a user-safe message. */
  initiate(input: PaymentIntentInput): Promise<Payment>;
}

function record(provider: PaymentProvider, input: PaymentIntentInput, status: Payment["status"]): Payment {
  return {
    id: `pay_${Date.now().toString(36)}`,
    orderId: input.orderId,
    provider,
    status,
    amount: input.amount,
    createdAt: new Date().toISOString(),
  };
}

/** Cash on delivery needs no gateway; the payment is captured at the door. */
const codAdapter: PaymentAdapter = {
  provider: "cod",
  async initiate(input) {
    return record("cod", input, "pending");
  },
};

/**
 * Template for gateway adapters. Replace the body with the provider SDK call
 * (e.g. Razorpay Checkout, Stripe Payment Element) and resolve once the
 * gateway confirms capture.
 */
function gatewayStub(provider: PaymentProvider): PaymentAdapter {
  return {
    provider,
    async initiate() {
      throw new Error(`${provider} is not configured yet. Add credentials to enable it.`);
    },
  };
}

const adapters: Record<PaymentProvider, PaymentAdapter> = {
  cod: codAdapter,
  upi: gatewayStub("upi"),
  razorpay: gatewayStub("razorpay"),
  stripe: gatewayStub("stripe"),
  card: gatewayStub("card"),
};

export async function getPaymentMethods(): Promise<PaymentMethodOption[]> {
  return paymentMethods;
}

export async function initiatePayment(
  provider: PaymentProvider,
  input: PaymentIntentInput,
): Promise<Payment> {
  const method = paymentMethods.find((m) => m.id === provider);
  if (!method?.enabled) {
    throw new Error(method?.disabledReason ?? "That payment method is unavailable.");
  }
  return adapters[provider].initiate(input);
}
