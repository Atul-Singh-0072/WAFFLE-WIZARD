import { ArrowRight, Flame, Leaf, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { DietBadge } from "@/components/ui/DietBadge";
import { Price } from "@/components/ui/Price";
import { BLUR_DATA_URL, media } from "@/data/media";
import { siteConfig } from "@/lib/config/site";
import { startingPrice } from "@/services/catalog";
import type { Product } from "@/types";

/** The three promises printed beside the pizza on the menu card. */
const proofPoints = [
  { icon: Flame, label: "Freshly baked, always" },
  { icon: Leaf, label: "100% veg" },
  { icon: ShieldCheck, label: "Hygienic preparation" },
];

export function Hero({ signature }: { signature?: Product }) {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      {/* Poster atmosphere: starfield, purple smoke and a gold glow. */}
      <div className="bg-starfield pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -left-32 top-10 h-[30rem] w-[30rem] rounded-full bg-primary-400/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-secondary/15 blur-3xl" aria-hidden />

      <div className="container-page relative grid items-center gap-10 pb-28 pt-8 md:pt-14 lg:grid-cols-12 lg:gap-8 lg:pb-36 lg:pt-16">
        {/* Copy */}
        <div className="lg:col-span-6">
          <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-surface/70 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-secondary shadow-xs backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-success/70" />
              <span className="relative size-2 rounded-full bg-success" />
            </span>
            Good food · Good mood · Now in {siteConfig.defaultCity}
          </p>

          {/* Brand line: reveals word by word above the headline, then keeps a slow glint. */}
          <p className="double-magic mt-6" aria-label="Double W, Double Magic">
            <span className="double-magic__star" aria-hidden>
              ✦
            </span>
            <span className="double-magic__word" aria-hidden>
              <span className="text-foil-blue">Double W</span>
            </span>
            <span className="double-magic__dot" aria-hidden>
              ·
            </span>
            <span className="double-magic__word is-second" aria-hidden>
              <span className="text-foil">Double Magic</span>
            </span>
            <span className="double-magic__star is-second" aria-hidden>
              ✦
            </span>
          </p>

          <h1 id="hero-heading" className="display-xl mt-3 text-text [animation-delay:80ms] animate-fade-up">
            Magic in
            <br />
            <span className="text-foil">Every Bite!</span>
          </h1>
          <p className="mt-4 font-display text-lg font-bold tracking-tight text-secondary-200 md:text-xl [animation-delay:120ms] animate-fade-up">
            Real ingredients. Real taste. Always!
          </p>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-text-soft md:text-lg [animation-delay:160ms] animate-fade-up">
            Freshly baked, 100% vegetarian pizzas — classic, premium and signature — plus magical combos and a choco
            pizza to finish. Every name and price exactly as on our menu card.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 [animation-delay:240ms] animate-fade-up">
            <Button href="/menu" size="xl" iconRight={<ArrowRight className="size-5" />}>
              Order now
            </Button>
            <Button href="/menu" size="xl" variant="outline">
              See the menu
            </Button>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 [animation-delay:320ms] animate-fade-up" aria-label="Our promises">
            {proofPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-semibold text-text-soft">
                <span className="flex size-8 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                  <Icon className="size-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual: the poster's own pizza, edges feathered into the dark page. */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[1000/620] w-full max-w-2xl [animation-delay:120ms] animate-fade-up">
            <div className="pointer-events-none absolute inset-[12%] rounded-full bg-secondary/25 blur-3xl" aria-hidden />
            <div className="motion-safe:animate-float relative h-full">
              <Image
                src={media.poster.heroPizza}
                alt="Freshly baked vegetarian pizza with olives, tomatoes and melting cheese"
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 640px, 92vw"
                className="hero-pizza object-contain drop-shadow-[0_26px_40px_rgba(0,0,0,0.55)]"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </div>

            {/* Floating signature card */}
            {signature && (
              <div className="absolute -bottom-3 left-2 flex max-w-[17rem] items-center gap-3 rounded-2xl border border-secondary/40 bg-panel p-3 text-[#1a1024] shadow-lg sm:-left-4 sm:bottom-6">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                  <Image src={signature.images[0]} alt="" fill sizes="48px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-accent-600">
                    Signature
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5">
                    <DietBadge diet={signature.diet} />
                    <span className="truncate text-sm font-bold">{signature.name}</span>
                  </span>
                  <span className="price-pill mt-1 text-sm font-extrabold">
                    <span className="text-[10px] font-semibold opacity-70">from</span>
                    <Price amount={startingPrice(signature)} size="sm" className="[&_span]:text-[#1a1024]" />
                  </span>
                </span>
              </div>
            )}

            {/* Service chip */}
            <div className="on-dark absolute -top-2 right-2 rounded-full border border-secondary/50 bg-ink px-4 py-2 text-xs font-bold text-secondary shadow-lg sm:-right-2 sm:top-4">
              Delivery · Pickup · Dine-in
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
