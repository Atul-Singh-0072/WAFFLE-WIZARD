import { ArrowRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="container-page pb-16 md:pb-24" aria-labelledby="cta-heading">
      <Reveal>
        <div className="gold-border relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3a2661] via-[#1c1130] to-ink px-6 py-14 text-center text-white shadow-xl md:px-12 md:py-20">
          <div className="bg-starfield pointer-events-none absolute inset-0" aria-hidden />
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-secondary/25 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-accent/25 blur-3xl" aria-hidden />

          <div className="relative mx-auto max-w-2xl">
            <p className="eyebrow text-secondary">Ready when you are</p>
            <h2 id="cta-heading" className="display-lg mt-3 text-white">
              Come for the pizza, <span className="text-foil">stay for the magic.</span>
            </h2>
            <p className="mt-4 text-lg text-white/75">
              Pick an outlet, choose your size, and track it from oven to door. Share the joy, double the happiness.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/menu" size="xl" iconRight={<ArrowRight className="size-5" />}>
                Order now
              </Button>
              <Button href="/stores" size="xl" variant="light" iconLeft={<MapPin className="size-5" />}>
                Find a store
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
