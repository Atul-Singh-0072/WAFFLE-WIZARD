import { Bell, Lock } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/common/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BLUR_DATA_URL } from "@/data/media";
import { cn } from "@/lib/utils/cn";
import { getIcon } from "@/lib/utils/icons";
import type { Category } from "@/types";

export function ComingSoon({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  // A single announced range gets a wide feature card instead of a lonely tile.
  const feature = categories.length === 1;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1c1130] via-[#150b24] to-ink text-white" aria-labelledby="coming-heading">
      <div className="bg-starfield pointer-events-none absolute inset-0" aria-hidden />

      <div className="container-page section-y relative">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Waffle Zone"
            title={
              <span id="coming-heading">
                There&apos;s more <span className="text-foil">magic</span> coming.
              </span>
            }
            description={
              feature
                ? "One more range is in development and is not available to order yet. We list it here so you know where the brand is heading — not to sell it early."
                : "These ranges are in development and are not available to order yet. We list them here so you know where the brand is heading — not to sell them early."
            }
            action={
              <Button href="#newsletter" variant="gold" size="md" iconLeft={<Bell className="size-4" />}>
                Notify me
              </Button>
            }
          />
        </Reveal>

        <ul className={cn("grid gap-4", feature ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-4")}>
          {categories.map((category, index) => {
            const Icon = getIcon(category.icon);
            return (
              <Reveal key={category.id} delay={index * 0.07}>
                <li
                  className={cn(
                    "group relative h-full list-none overflow-hidden rounded-xl border border-white/10 bg-white/5",
                    feature && "grid md:grid-cols-12",
                  )}
                  aria-label={`${category.name}: coming soon, not orderable yet`}
                >
                  <div className={cn("relative overflow-hidden", feature ? "aspect-[16/9] md:col-span-5 md:aspect-auto md:min-h-[18rem]" : "aspect-[16/10]")}>
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      sizes={feature ? "(min-width: 768px) 40vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
                      className="object-cover opacity-40 grayscale transition-[opacity,filter] duration-500 group-hover:opacity-55 group-hover:grayscale-[60%]"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                    <div className={cn("absolute inset-0 bg-gradient-to-t from-[#150b24] to-transparent", feature && "md:bg-gradient-to-r")} aria-hidden />
                    <span className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/10 text-secondary backdrop-blur">
                      <Icon className="size-4" />
                    </span>
                    <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-ink/70 text-white/80">
                      <Lock className="size-3.5" />
                    </span>
                  </div>
                  <div className={cn("p-4", feature && "flex flex-col justify-center p-6 md:col-span-7 md:p-10")}>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={cn("font-display font-bold", feature ? "text-3xl md:text-4xl" : "text-xl")}>{category.name}</h3>
                      <Badge tone="gold">Phase {category.launchPhase}</Badge>
                    </div>
                    <p className={cn("mt-2 leading-relaxed text-white/65", feature ? "text-base md:text-lg" : "text-sm")}>{category.description}</p>
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-secondary/90">
                      {category.comingSoonNote ?? "Coming soon"} · Not available yet
                    </p>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
