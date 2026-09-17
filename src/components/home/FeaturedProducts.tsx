import { ArrowRight } from "lucide-react";
import { Rail } from "@/components/common/Rail";
import { Reveal } from "@/components/common/Reveal";
import { ProductCard } from "@/components/menu/ProductCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="section-y" aria-labelledby="featured-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Pizza menu · Hot · Fresh · Delicious"
            title={
              <span id="featured-heading">
                Straight off the <span className="text-foil">menu card.</span>
              </span>
            }
            description="Our most-loved pizzas — every name and price exactly as printed. Pick a size on the card and add to cart."
            action={
              <Button href="/menu" variant="outline" size="md" iconRight={<ArrowRight className="size-4" />}>
                Full menu
              </Button>
            }
          />
        </Reveal>

        <Rail label="Featured pizzas">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} layout="rail" priority={index < 2} />
          ))}
        </Rail>
      </div>
    </section>
  );
}
