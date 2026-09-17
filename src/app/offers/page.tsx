import type { Metadata } from "next";
import { ArrowRight, Info } from "lucide-react";
import { JsonLd } from "@/components/common/JsonLd";
import { PageHeader } from "@/components/common/PageHeader";
import { OfferCard } from "@/components/offers/OfferCard";
import { Button } from "@/components/ui/Button";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { getOffers } from "@/services/promotions";

export const metadata: Metadata = buildMetadata({
  title: "Magical Combos — more pizza, more fun, more savings",
  description: "The Magical Combos from the Waffle Wizard menu card: Classic, Premium, Family and Pizza Party — priced exactly as printed.",
  path: "/offers",
});

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Offers", path: "/offers" }])} />
      <PageHeader
        eyebrow="Magical Combos"
        title={
          <>
            More pizza. More fun. <span className="text-foil">More savings.</span>
          </>
        }
        description="Four combos straight off the menu card, with the card’s own strike-through prices. No codes needed — pick one and add it to your cart."
        crumbs={[{ label: "Offers" }]}
        aside={
          <Button href="/menu" size="lg" iconRight={<ArrowRight className="size-4" />}>
            Start an order
          </Button>
        }
      />

      <div className="container-page pb-16 pt-8">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <li key={offer.id}>
              <OfferCard offer={offer} className="h-full" />
            </li>
          ))}
        </ul>

        <section className="mt-12 rounded-2xl border border-border bg-surface p-6 md:p-8" aria-labelledby="terms-heading">
          <h2 id="terms-heading" className="font-display text-2xl font-bold text-text">
            What each combo includes
          </h2>
          <p className="mt-1 text-sm text-muted">Pizza choices are made on the combo’s page.</p>
          <div className="mt-6 divide-y divide-border">
            {offers.map((offer) => (
              <details key={offer.id} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-text [&::-webkit-details-marker]:hidden">
                  <span>
                    {offer.title}
                    {offer.couponCode && <span className="ml-2 rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-bold tracking-wide text-primary-800">{offer.couponCode}</span>}
                  </span>
                  <span className="text-muted transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-soft">
                  {offer.terms.map((term) => (
                    <li key={term}>{term}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
          <p className="mt-6 flex items-start gap-2 text-xs text-muted">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            Combo prices and savings are as printed on the Waffle Wizard menu card.
          </p>
        </section>
      </div>
    </>
  );
}
