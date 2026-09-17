import type { Metadata } from "next";
import { Marquee } from "@/components/common/Marquee";
import { BrandStory } from "@/components/home/BrandStory";
import { CategoryRail } from "@/components/home/CategoryRail";
import { ComingSoon } from "@/components/home/ComingSoon";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { OffersSection } from "@/components/home/OffersSection";
import { QuickOrderBar } from "@/components/home/QuickOrderBar";
import { Reviews } from "@/components/home/Reviews";
import { SignatureSection } from "@/components/home/SignatureSection";
import { StoreLocatorPreview } from "@/components/home/StoreLocatorPreview";
import { WhyUs } from "@/components/home/WhyUs";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo";
import { getFeaturedProducts, getLiveCategories, getSignatureProduct, getUpcomingCategories } from "@/services/catalog";
import { getFeaturedOffers } from "@/services/promotions";
import { getRatingSummary, getReviews } from "@/services/reviews";
import { getStores } from "@/services/stores";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — 100% veg pizza delivery, pickup & dine-in in ${siteConfig.defaultCity}`,
  description: `Freshly baked, 100% vegetarian pizzas from ${siteConfig.name}. Classic, premium and signature pizzas, magical combos and choco pizza — priced exactly as on our menu card. Delivery, pickup and dine-in across ${siteConfig.defaultCity}.`,
  path: "/",
});

const tickerItems = [
  "Hot · Fresh · Delicious",
  "Freshly baked always",
  "Real ingredients, real taste",
  "100% veg",
  "Magic in every bite",
  "Delivery · Pickup · Dine-in",
  "Come for the pizza, stay for the magic",
];

export default async function HomePage() {
  const [featured, signature, liveCategories, upcomingCategories, offers, stores, reviews] = await Promise.all([
    getFeaturedProducts(5),
    getSignatureProduct(),
    getLiveCategories(),
    getUpcomingCategories(),
    getFeaturedOffers(4),
    getStores(),
    getReviews(6),
  ]);
  const ratingSummary = await getRatingSummary(reviews);

  return (
    <>
      <Hero signature={signature} />
      <QuickOrderBar />
      <Marquee items={tickerItems} className="mt-14 md:mt-20" />
      <FeaturedProducts products={featured} />
      <CategoryRail live={liveCategories} upcoming={upcomingCategories} />
      <SignatureSection product={signature} />
      <OffersSection offers={offers} />
      <StoreLocatorPreview stores={stores} />
      <WhyUs />
      <ComingSoon categories={upcomingCategories} />
      <BrandStory />
      <Reviews reviews={reviews} summary={ratingSummary} />
      <FinalCTA />
    </>
  );
}
