import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { JsonLd } from "@/components/common/JsonLd";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { faqGroups } from "@/data/content";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "FAQs",
  description: "Answers about ordering, delivery, pickup, payments, refunds and the menu.",
  path: "/faqs",
});

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={[faqSchema(faqGroups), breadcrumbSchema([{ name: "FAQs", path: "/faqs" }])]} />
      <PageHeader eyebrow="Help" title="Frequently asked questions" description="Short answers to the things people ask most. If yours is not here, the contact page is one tap away." crumbs={[{ label: "FAQs" }]} />

      <div className="container-page grid gap-10 pb-16 pt-4 lg:grid-cols-12">
        <nav className="lg:col-span-3" aria-label="FAQ sections">
          <ul className="flex flex-wrap gap-2 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:flex-col">
            {faqGroups.map((group) => (
              <li key={group.title}>
                <a href={`#${group.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z-]/g, "")}`} className="inline-flex h-9 items-center rounded-full border border-border bg-surface px-4 text-sm font-semibold text-text-soft hover:border-primary-300 hover:text-primary-800">
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-10 lg:col-span-9">
          {faqGroups.map((group) => {
            const id = group.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z-]/g, "");
            return (
              <section key={group.title} id={id} className="scroll-mt-28" aria-labelledby={`${id}-heading`}>
                <h2 id={`${id}-heading`} className="display-md text-text">
                  {group.title}
                </h2>
                <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-surface">
                  {group.items.map((item) => (
                    <details key={item.question} className="group px-5 py-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-text [&::-webkit-details-marker]:hidden">
                        {item.question}
                        <ChevronDown className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-text-soft">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}

          <div className="rounded-2xl bg-primary-50 p-6 text-center">
            <p className="font-display text-lg font-bold text-primary-900">Still stuck?</p>
            <Button href="/contact" size="md" className="mt-3">
              Contact us
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
