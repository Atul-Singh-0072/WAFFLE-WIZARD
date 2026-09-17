import { ArrowRight, Clock, Users } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/common/Reveal";
import { Button } from "@/components/ui/Button";
import { DietBadge } from "@/components/ui/DietBadge";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { BLUR_DATA_URL } from "@/data/media";
import { startingPrice } from "@/services/catalog";
import type { Product } from "@/types";

export function SignatureSection({ product }: { product?: Product }) {
  if (!product) return null;

  return (
    <section className="on-dark relative overflow-hidden bg-ink text-white" aria-labelledby="signature-heading">
      <div className="bg-starfield pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-primary-700/35 blur-3xl" aria-hidden />

      <div className="container-page section-y relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <div className="absolute inset-0 rounded-full border border-secondary/30" aria-hidden />
            <div className="absolute inset-6 rounded-full border border-dashed border-secondary/20 motion-safe:[animation:spin-slow_60s_linear_infinite]" aria-hidden />
            <div className="absolute inset-10 overflow-hidden rounded-full shadow-xl ring-4 ring-secondary/20">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </div>
            <span className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-secondary px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-ink shadow-gold">
              Signature
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6">
          <p className="eyebrow text-secondary">Signature pizzas · Our special creations</p>
          <h2 id="signature-heading" className="display-lg mt-3 text-white">
            Extra cheese.
            <br />
            <span className="text-foil">Extra happiness.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/75">{product.longDescription ?? product.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <DietBadge diet={product.diet} /> 100% veg
            </span>
            {product.serves && (
              <span className="inline-flex items-center gap-2">
                <Users className="size-4 text-secondary" /> Serves {product.serves}
              </span>
            )}
            {product.prepTimeMins && (
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4 text-secondary" /> {product.prepTimeMins} min in the kitchen
              </span>
            )}
          </div>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Ingredients">
            {product.ingredients.map((ingredient) => (
              <li key={ingredient} className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85">
                {ingredient}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button href={`/menu/${product.slug}`} size="xl" variant="gold" iconRight={<ArrowRight className="size-5" />}>
              Customise & order
            </Button>
            <div className="flex flex-col">
              <Price amount={startingPrice(product)} compareAt={product.compareAtPrice} from size="lg" className="[&_span]:text-white [&_span:nth-child(3)]:text-white/50" />
              {product.rating && <Rating value={product.rating} count={product.ratingCount} className="mt-1 [&_span]:text-white/70" />}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
