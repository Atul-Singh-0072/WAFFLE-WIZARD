import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderTracker } from "@/components/orders/OrderTracker";
import { buildMetadata } from "@/lib/seo";

interface Params {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { code } = await params;
  return buildMetadata({ title: `Order ${code}`, description: "Live order status.", path: `/track/${code}`, noIndex: true });
}

export default async function OrderPage({ params }: Params) {
  const { code } = await params;
  return (
    <Suspense>
      <OrderTracker code={code} />
    </Suspense>
  );
}
