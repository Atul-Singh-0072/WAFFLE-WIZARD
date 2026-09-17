import { ArrowRight, CheckCircle2, CircleDashed, Hammer } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { Button } from "@/components/ui/Button";
import { brandStory } from "@/data/content";
import { cn } from "@/lib/utils/cn";

const phaseIcon = {
  live: CheckCircle2,
  "in-development": Hammer,
  planned: CircleDashed,
} as const;

const phaseLabel = {
  live: "Live",
  "in-development": "In development",
  planned: "Planned",
} as const;

export function BrandStory() {
  return (
    <section className="section-y bg-surface" aria-labelledby="story-heading">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow text-accent">{brandStory.eyebrow}</p>
          <h2 id="story-heading" className="display-lg mt-3 text-text">
            {brandStory.heading}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-text-soft md:text-lg">
            {brandStory.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
          <Button href="/about" variant="outline" size="lg" className="mt-8" iconRight={<ArrowRight className="size-4" />}>
            Read the full story
          </Button>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6">
          <ol className="relative space-y-4 border-l-2 border-border pl-6">
            {brandStory.phases.map((phase) => {
              const Icon = phaseIcon[phase.status];
              const live = phase.status === "live";
              return (
                <li key={phase.phase} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[2.05rem] top-4 flex size-8 items-center justify-center rounded-full border-2 bg-surface",
                      live ? "border-success text-success" : "border-border text-muted",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div
                    className={cn(
                      "rounded-xl border p-5",
                      live ? "border-primary-100 bg-primary-50/50" : "border-border bg-surface",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{phase.phase}</span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                          live ? "bg-success text-white" : "bg-surface-2 text-text-soft",
                        )}
                      >
                        {phaseLabel[phase.status]}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-display text-xl font-bold text-text">{phase.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{phase.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            {brandStory.facts.map((fact) => (
              <div key={fact.label} className="rounded-xl border border-border bg-surface-2/60 p-4">
                <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{fact.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-text">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
