import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { JsonLd } from "@/components/common/JsonLd";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { isPlaceholder, siteConfig } from "@/lib/config/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { whatsappNumbers } from "@/lib/utils/whatsapp";
import { SocialIcon } from "@/components/common/SocialIcon";

const WhatsappIcon = ({ className }: { className?: string }) => <SocialIcon name="Whatsapp" className={className} width={20} height={20} />;

export const metadata: Metadata = buildMetadata({
  title: "Contact us",
  description: `Questions about an order, franchise enquiries, partnerships or careers — reach the ${siteConfig.name} team.`,
  path: "/contact",
});

interface ContactCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  href?: string;
  note: string;
  links?: { label: string; href: string }[];
  cta?: { label: string; href: string };
}

const cards: ContactCard[] = [
  {
    icon: Phone,
    title: "Call us",
    body: siteConfig.contact.phone2 ? `${siteConfig.contact.phone} / ${siteConfig.contact.phone2}` : siteConfig.contact.phone,
    href: isPlaceholder(siteConfig.contact.phone) ? undefined : `tel:${siteConfig.contact.phoneRaw}`,
    note: siteConfig.contact.hours,
  },
  {
    icon: WhatsappIcon,
    title: "WhatsApp",
    body: "Message us on either number",
    links: whatsappNumbers.map((line) => ({ label: line.display, href: line.href })),
    note: "Quickest for order questions and bulk enquiries",
  },
  {
    icon: Mail,
    title: "Email",
    body: siteConfig.contact.email,
    href: isPlaceholder(siteConfig.contact.email) ? undefined : `mailto:${siteConfig.contact.email}`,
    note: "We reply within one working day",
  },
  {
    icon: MapPin,
    title: "Head office",
    body: `${siteConfig.headOffice.line1}, ${siteConfig.headOffice.city}`,
    note: `${siteConfig.headOffice.state} ${siteConfig.headOffice.pincode}`,
  },
  {
    icon: Clock,
    title: "Order issues",
    body: "Contact the outlet directly",
    note: "Fastest for anything about a live order",
    cta: { label: "Find your outlet", href: "/stores" },
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
      <PageHeader eyebrow="Contact" title="Talk to the team" description="For a live order, the outlet can help fastest. For everything else — feedback, franchise, partnerships, careers — use the form." crumbs={[{ label: "Contact" }]} />

      <div className="container-page grid gap-8 pb-16 pt-6 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-7">
            <Suspense>
              <ContactForm />
            </Suspense>
          </div>
        </div>
        <aside className="grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-2xl border border-border bg-surface p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-3 font-display text-lg font-bold text-text">{card.title}</h2>
                {card.href ? (
                  <a href={card.href} className="mt-1 block text-sm font-semibold text-primary-800 hover:underline">
                    {card.body}
                  </a>
                ) : (
                  <p className="mt-1 text-sm font-semibold text-text">{card.body}</p>
                )}
                {card.links && (
                  <p className="mt-1.5 flex flex-wrap gap-2">
                    {card.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#25d366] px-3.5 text-sm font-bold text-[#062b16] hover:bg-[#3ee27d]"
                      >
                        <SocialIcon name="Whatsapp" width={15} height={15} />
                        {link.label}
                      </a>
                    ))}
                  </p>
                )}
                <p className="mt-0.5 text-xs text-muted">{card.note}</p>
                {card.cta && (
                  <Button href={card.cta.href} size="sm" variant="outline" className="mt-3">
                    {card.cta.label}
                  </Button>
                )}
              </div>
            );
          })}
        </aside>
      </div>
    </>
  );
}
