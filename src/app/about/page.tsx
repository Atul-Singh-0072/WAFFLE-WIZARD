import type { Metadata } from "next";
import { ArrowRight, Handshake } from "lucide-react";
import Image from "next/image";
import { JsonLd } from "@/components/common/JsonLd";
import { PageHeader } from "@/components/common/PageHeader";
import { BrandStory } from "@/components/home/BrandStory";
import { FoundersSection } from "@/components/home/FoundersSection";
import { WhyUs } from "@/components/home/WhyUs";
import { Button } from "@/components/ui/Button";
import { BLUR_DATA_URL, media } from "@/data/media";
import { siteConfig } from "@/lib/config/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: `About ${siteConfig.name}`,
  description: `${siteConfig.name} is a multi-category food brand launching with pizza. Read how the brand is being built, what is live today, and what comes next.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />
      <PageHeader
        eyebrow="About"
        title={
          <>
            Good food. Good mood.
            <br className="hidden sm:block" /> <span className="text-foil">Magic in every bite.</span>
          </>
        }
        description="A 100% vegetarian pizza brand: real ingredients, real taste, always — with the Waffle Zone coming next."
        crumbs={[{ label: "About" }]}
      />

      <div className="container-page">
        <div className="relative aspect-[21/9] overflow-hidden rounded-3xl shadow-lg">
          <Image src={media.pizza.cheesyBlast} alt="Pizza fresh from the stone deck" fill priority sizes="100vw" className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" aria-hidden />
          <p className="absolute bottom-6 left-6 max-w-lg font-display text-2xl font-bold text-white md:text-3xl">
            Freshly baked. Always.
          </p>
        </div>
      </div>

      <BrandStory />
      <FoundersSection />
      <WhyUs />

      <section className="container-page pb-16 md:pb-24" aria-labelledby="partner-heading">
        <div className="grid gap-6 rounded-3xl border border-border bg-surface p-6 shadow-sm md:grid-cols-12 md:items-center md:p-10">
          <div className="md:col-span-8">
            <p className="eyebrow text-accent">Franchise & partnerships</p>
            <h2 id="partner-heading" className="display-md mt-2 text-text">
              Bring {siteConfig.name} to your city.
            </h2>
            <p className="mt-3 text-muted">
              We are opening conversations with franchise partners, delivery platforms and suppliers. If that is you, tell us a little about yourself.
            </p>
          </div>
          <div className="flex gap-2 md:col-span-4 md:justify-end">
            <Button href="/contact?topic=franchise" size="lg" iconLeft={<Handshake className="size-5" />} iconRight={<ArrowRight className="size-4" />}>
              Enquire
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
