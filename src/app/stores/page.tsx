import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/common/JsonLd";
import { PageHeader } from "@/components/common/PageHeader";
import { StoresExplorer } from "@/components/stores/StoresExplorer";
import { siteConfig } from "@/lib/config/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { getStores } from "@/services/stores";

export const metadata: Metadata = buildMetadata({
  title: `Store locator — ${siteConfig.name} in ${siteConfig.defaultCity}`,
  description: `Find ${siteConfig.name} in ${siteConfig.defaultCity}. Check opening hours, get directions, and see whether delivery, pickup and dine-in are offered.`,
  path: "/stores",
});

export default async function StoresPage() {
  const stores = await getStores();
  const live = stores.filter((s) => s.status === "live").length;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Stores", path: "/stores" }])} />
      <PageHeader
        eyebrow="Store locator"
        title={
          <>
            {live} {live === 1 ? "outlet" : "outlets"} in {siteConfig.defaultCity},
            <br className="hidden sm:block" /> and <span className="text-foil">counting.</span>
          </>
        }
        description="Search your area, use your location, or browse the map. See live opening status, the services on offer, and get directions."
        crumbs={[{ label: "Stores" }]}
      />
      <Suspense>
        <StoresExplorer stores={stores} />
      </Suspense>
    </>
  );
}
