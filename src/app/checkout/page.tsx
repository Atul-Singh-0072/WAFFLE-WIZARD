import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout",
  description: "Confirm your outlet, address and payment.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutFlow />;
}
