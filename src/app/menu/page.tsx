import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { JsonLd } from "@/components/common/JsonLd";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { siteConfig } from "@/lib/config/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { getCategories, getProducts } from "@/services/catalog";

export const metadata: Metadata = buildMetadata({
  title: `Pizza menu — classic, premium, signature & combos`,
  description: `The full ${siteConfig.name} menu — 100% vegetarian pizzas in Regular, Medium and Large, magical combos and choco pizza, priced exactly as on the menu card. Order online for delivery or pickup in ${siteConfig.defaultCity}.`,
  path: "/menu",
});

function MenuFallback() {
  return (
    <div className="container-page grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function MenuPage() {
  const [products, categories] = await Promise.all([getProducts({ sort: "popular" }), getCategories()]);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Menu", path: "/menu" }])} />
      <PageHeader
        eyebrow="Menu"
        title={
          <>
            Hot. Fresh.
            <br className="hidden sm:block" /> <span className="text-foil">Delicious.</span>
          </>
        }
        description={"Every pizza in Regular (6\"), Medium (9\") and Large (12\"), priced exactly as printed on our card. Search by name or ingredient, or jump straight to a section."}
      />
      <Suspense fallback={<MenuFallback />}>
        <MenuBrowser products={products} categories={categories} />
      </Suspense>
    </>
  );
}
