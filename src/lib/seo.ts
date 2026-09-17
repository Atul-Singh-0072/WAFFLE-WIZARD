import type { Metadata } from "next";
import { siteConfig, isPlaceholder } from "@/lib/config/site";
import { media } from "@/data/media";
import { DAY_NAMES } from "@/lib/utils/hours";
import { startingPrice } from "@/services/catalog";
import type { Category, Product, Store } from "@/types";
import type { FaqGroup, FaqItem } from "@/data/content";

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

interface BuildMetadataInput {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}

/** Consistent per-page metadata: canonical, Open Graph, Twitter, robots. */
export function buildMetadata({
  title,
  description,
  path = "/",
  image = media.pizza.cheesyBlast,
  noIndex = false,
  type = "website",
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      ...(isPlaceholder(siteConfig.seo.twitterHandle) ? {} : { site: siteConfig.seo.twitterHandle }),
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

/* ------------------------------------------------------------------ */
/* Structured data                                                     */
/* ------------------------------------------------------------------ */

type JsonLdObject = Record<string, unknown>;

/** Omits placeholder values so schema never publishes "[PHONE NUMBER]". */
function real(value: string | undefined): string | undefined {
  return value && !isPlaceholder(value) ? value : undefined;
}

export function organizationSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/brand/logo-lockup-v3.png"),
    description: siteConfig.description,
    telephone: real(siteConfig.contact.phone),
    email: real(siteConfig.contact.email),
    founder: siteConfig.founders.map((name) => ({ "@type": "Person", name })),
    foundingDate: siteConfig.foundedYear,
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook, siteConfig.social.youtube].filter(
      (link) => !isPlaceholder(link),
    ),
  };
}

export function websiteSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/menu")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessSchema(store: Store): JsonLdObject {
  const openingHoursSpecification = store.openingHours
    .map((day, index) =>
      day
        ? {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: DAY_NAMES[index],
            opens: day.open,
            closes: day.close,
          }
        : null,
    )
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": absoluteUrl(`/stores/${store.slug}`),
    name: store.name,
    url: absoluteUrl(`/stores/${store.slug}`),
    image: store.image,
    servesCuisine: "Pizza",
    priceRange: "₹₹",
    telephone: real(store.phone),
    address: {
      "@type": "PostalAddress",
      streetAddress: real(store.addressLine1),
      addressLocality: store.locality,
      addressRegion: store.state,
      postalCode: store.pincode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: store.latitude,
      longitude: store.longitude,
    },
    openingHoursSpecification,
    hasDeliveryMethod: store.services.includes("delivery") ? "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet" : undefined,
    parentOrganization: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };
}

export function productSchema(product: Product, category?: Category): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription ?? product.description,
    image: product.images,
    category: category?.name,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/menu/${product.slug}`),
      priceCurrency: siteConfig.currency,
      price: startingPrice(product),
      availability:
        product.availability === "live" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    },
    ...(product.rating && product.ratingCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.ratingCount,
          },
        }
      : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(groups: FaqGroup[]): JsonLdObject {
  const items: FaqItem[] = groups.flatMap((group) => group.items);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Serialises for a <script type="application/ld+json">, escaping `<`. */
export function serializeJsonLd(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
