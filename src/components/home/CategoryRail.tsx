import { ArrowUpRight, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BLUR_DATA_URL } from "@/data/media";
import { cn } from "@/lib/utils/cn";
import { getIcon } from "@/lib/utils/icons";
import type { Category } from "@/types";

interface CategoryRailProps {
  live: Category[];
  upcoming: Category[];
}

export function CategoryRail({ live, upcoming }: CategoryRailProps) {
  return (
    <section className="section-y bg-surface" aria-labelledby="categories-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Pizza menu"
            title={<span id="categories-heading">Classic. Premium. Signature.</span>}
            description="Five sections, exactly as on the card. The Waffle Zone is coming soon — and we say so clearly rather than list it as if you can order it."
          />
        </Reveal>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {live.map((category, index) => {
            const Icon = getIcon(category.icon);
            return (
              <Reveal key={category.id} delay={index * 0.05}>
                <li className="list-none">
                  <Link
                    href={`/menu?category=${category.slug}`}
                    className="on-dark group relative block aspect-[4/5] overflow-hidden rounded-xl bg-ink shadow-sm transition-[transform,box-shadow] duration-300 hover:shadow-lg motion-safe:hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary-300/70"
                  >
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" aria-hidden />
                    <span className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
                      <Icon className="size-4" />
                    </span>
                    <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-secondary text-ink opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowUpRight className="size-4" />
                    </span>
                    <span className="absolute inset-x-4 bottom-4">
                      <span className="block font-display text-xl font-bold text-white">{category.name}</span>
                      <span className="mt-0.5 block text-xs text-white/70">{category.tagline}</span>
                    </span>
                  </Link>
                </li>
              </Reveal>
            );
          })}

          {/* One locked tile; below lg it spans two columns so 4 live + 1 always fills the row. */}
          {upcoming.slice(0, 1).map((category, index) => {
            const Icon = getIcon(category.icon);
            return (
              <Reveal key={category.id} delay={(live.length + index) * 0.05} className="max-lg:col-span-2">
                <li className={cn("list-none")} aria-label={`${category.name} — coming soon, not orderable yet`}>
                  <div className="relative block aspect-[8/5] overflow-hidden rounded-xl border-2 border-dashed border-primary-200 bg-surface-2 lg:aspect-[4/5]">
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover opacity-25 grayscale"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                      <span className="flex size-10 items-center justify-center rounded-full bg-primary-100 text-primary">
                        <Lock className="size-4" />
                      </span>
                      <span className="font-display text-lg font-bold text-primary-900">{category.name}</span>
                      <Badge tone="primary">Coming soon</Badge>
                    </div>
                    <span className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/70 text-primary">
                      <Icon className="size-4" />
                    </span>
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
