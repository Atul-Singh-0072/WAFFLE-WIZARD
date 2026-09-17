import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { legalDocuments } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return legalDocuments.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const doc = legalDocuments.find((d) => d.slug === slug);
  if (!doc) return { title: "Not found" };
  return buildMetadata({ title: doc.title, description: doc.summary, path: `/legal/${doc.slug}`, noIndex: true });
}

export default async function LegalPage({ params }: Params) {
  const { slug } = await params;
  const doc = legalDocuments.find((d) => d.slug === slug);
  if (!doc) notFound();

  return (
    <>
      <PageHeader eyebrow="Legal" title={doc.title} description={doc.summary} crumbs={[{ label: doc.title }]} />
      <div className="container-page max-w-3xl pb-16 pt-4">
        <p className="mb-8 flex items-start gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-secondary-900" role="note">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          Placeholder document. The final text must be supplied and reviewed by the business before this page is published.
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Last updated: {doc.lastUpdated}</p>
        <div className="prose-sm mt-6 space-y-8">
          {doc.sections.map((section, index) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-bold text-text">
                {index + 1}. {section.heading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-soft">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
