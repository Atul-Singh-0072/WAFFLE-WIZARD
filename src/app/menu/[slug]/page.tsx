import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { JsonLd } from "@/components/common/JsonLd";
import { Rail } from "@/components/common/Rail";
import { ProductCard } from "@/components/menu/ProductCard";
import { ProductCustomizer } from "@/components/product/ProductCustomizer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbSchema, buildMetadata, productSchema } from "@/lib/seo";
import { getCategories, getProductBySlug, getProductSlugs, getRelatedProducts, isProductOrderable } from "@/services/catalog";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return buildMetadata({
    title: product.name,
    description: product.longDescription ?? product.description,
    path: `/menu/${product.slug}`,
    image: product.images[0],
  });
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categories = await getCategories();
  const category = categories.find((c) => c.id === product.categoryId);
  if (!isProductOrderable(product, category)) notFound();

  const related = await getRelatedProducts(product, 6);

  return (
    <>
      <JsonLd
        data={[
          productSchema(product, category),
          breadcrumbSchema([
            { name: "Menu", path: "/menu" },
            { name: category?.name ?? "Menu", path: `/menu?category=${category?.slug ?? ""}` },
            { name: product.name, path: `/menu/${product.slug}` },
          ]),
        ]}
      />

      <div className="container-page pt-5">
        <Breadcrumbs
          items={[
            { label: "Menu", href: "/menu" },
            { label: category?.name ?? "Menu", href: `/menu?category=${category?.slug ?? ""}` },
            { label: product.name },
          ]}
        />
      </div>

      <Suspense>
        <ProductCustomizer product={product} category={category} />
      </Suspense>

      {related.length > 0 && (
        <section className="section-y border-t border-border bg-surface" aria-labelledby="related-heading">
          <div className="container-page">
            <SectionHeading eyebrow="Goes well with" title={<span id="related-heading">Round out the order</span>} />
            <Rail label="Related items">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} layout="rail" />
              ))}
            </Rail>
          </div>
        </section>
      )}
    </>
  );
}
