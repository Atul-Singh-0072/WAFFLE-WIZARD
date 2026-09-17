import { ArrowRight } from "lucide-react";
import { Rail } from "@/components/common/Rail";
import { Reveal } from "@/components/common/Reveal";
import { OfferCard } from "@/components/offers/OfferCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Offer } from "@/types";

export function OffersSection({ offers }: { offers: Offer[] }) {
  if (offers.length === 0) return null;

  return (
    <section className="section-y" aria-labelledby="offers-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Offers"
            title={<span id="offers-heading">Deals worth the detour</span>}
            description="Tap a code to copy it, then paste it in your cart. Terms sit on each offer's page."
            action={
              <Button href="/offers" variant="outline" size="md" iconRight={<ArrowRight className="size-4" />}>
                View all offers
              </Button>
            }
          />
        </Reveal>

        <Rail label="Current offers">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} layout="rail" />
          ))}
        </Rail>
      </div>
    </section>
  );
}
