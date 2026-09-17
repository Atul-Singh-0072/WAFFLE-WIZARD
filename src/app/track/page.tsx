import type { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { TrackLookup } from "@/components/orders/TrackLookup";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Track your order",
  description: "Enter your order code to follow it from the kitchen to your door.",
  path: "/track",
  noIndex: true,
});

export default function TrackPage() {
  return (
    <>
      <PageHeader eyebrow="Order tracking" title="Where is my order?" description="Enter the code from your confirmation screen. Recent orders placed on this device are listed below." crumbs={[{ label: "Track order" }]} />
      <TrackLookup />
    </>
  );
}
