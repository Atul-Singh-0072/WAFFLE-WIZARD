import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { valueProps } from "@/data/content";
import { siteConfig } from "@/lib/config/site";
import { getIcon } from "@/lib/utils/icons";

export function WhyUs() {
  return (
    <section className="section-y" aria-labelledby="why-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow={`Why ${siteConfig.name}`}
            title={<span id="why-heading">Good food, good mood</span>}
            description="The promises printed on our menu card — and how we keep them on every order."
            align="center"
          />
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((prop, index) => {
            const Icon = getIcon(prop.icon);
            return (
              <Reveal key={prop.title} delay={index * 0.06}>
                <li className="group h-full list-none rounded-xl border border-border bg-surface p-6 transition-[border-color,box-shadow] hover:border-primary-200 hover:shadow-md">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-[#1a1024] shadow-gold transition-transform duration-300 group-hover:-rotate-6">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-text">{prop.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{prop.description}</p>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
