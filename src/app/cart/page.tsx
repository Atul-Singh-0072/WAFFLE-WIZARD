import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Your cart",
  description: "Review your order, apply a promo code and head to checkout.",
  path: "/cart",
  noIndex: true,
});

export default function Page() {
  return <CartPage />;
}
