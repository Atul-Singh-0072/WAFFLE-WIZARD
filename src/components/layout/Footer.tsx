import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { SocialIcon } from "@/components/common/SocialIcon";
import { FooterSocialProof } from "@/components/layout/FooterSocialProof";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { footerColumns, socialLinks } from "@/lib/config/nav";
import { isPlaceholder, siteConfig } from "@/lib/config/site";
import { whatsappNumbers } from "@/lib/utils/whatsapp";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark relative mt-auto overflow-hidden bg-ink text-white">
      <div className="bg-starfield pointer-events-none absolute inset-0 opacity-80" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-primary-700/30 blur-3xl"
        aria-hidden
      />

      <div className="container-page relative">
        {/* Newsletter band */}
        <div id="newsletter" className="flex scroll-mt-24 flex-col gap-6 border-b border-white/10 py-12 md:flex-row md:items-center md:justify-between md:py-14">
          <div className="max-w-md">
            <p className="eyebrow text-secondary">Newsletter</p>
            <h2 className="display-md mt-2 text-white">Get deals & new product drops.</h2>
            <p className="mt-2 text-sm text-white/65">
              Launch announcements, promo codes and the odd secret menu item. No spam, unsubscribe any time.
            </p>
          </div>
          <NewsletterForm />
        </div>

        {/* Link grid */}
        <div className="grid gap-10 py-12 md:grid-cols-12 md:py-14">
          <div className="md:col-span-6 lg:col-span-3">
            <Logo tone="dark" variant="full" size="md" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">{siteConfig.description}</p>

            <ul className="mt-6 space-y-2.5 text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" />
                <span>
                  {siteConfig.headOffice.line1}, {siteConfig.headOffice.city}, {siteConfig.headOffice.state} {siteConfig.headOffice.pincode}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-secondary" />
                {isPlaceholder(siteConfig.contact.phone) ? (
                  <span>{siteConfig.contact.phone}</span>
                ) : (
                  <span>
                    <a href={`tel:${siteConfig.contact.phoneRaw}`} className="hover:text-white">
                      {siteConfig.contact.phone}
                    </a>
                    {siteConfig.contact.phone2 && (
                      <>
                        <span className="mx-1.5 text-white/40">/</span>
                        <a href={`tel:${siteConfig.contact.phone2Raw}`} className="hover:text-white">
                          {siteConfig.contact.phone2}
                        </a>
                      </>
                    )}
                  </span>
                )}
              </li>
              <li className="flex items-center gap-2.5">
                <SocialIcon name="Whatsapp" width={16} height={16} className="shrink-0 text-secondary" />
                <span>
                  {whatsappNumbers.map((line, index) => (
                    <span key={line.raw}>
                      {index > 0 && <span className="mx-1.5 text-white/40">/</span>}
                      <a href={line.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                        {line.display}
                      </a>
                    </span>
                  ))}
                  <span className="ml-1.5 text-xs text-white/45">WhatsApp</span>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-secondary" />
                {isPlaceholder(siteConfig.contact.email) ? (
                  <span>{siteConfig.contact.email}</span>
                ) : (
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">
                    {siteConfig.contact.email}
                  </a>
                )}
              </li>
            </ul>

            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={isPlaceholder(social.href) ? "#" : social.href}
                  aria-label={social.label}
                  aria-disabled={isPlaceholder(social.href)}
                  target={isPlaceholder(social.href) ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/80 transition-colors hover:border-secondary hover:bg-secondary hover:text-ink"
                >
                  <SocialIcon name={social.icon} />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="md:col-span-4 lg:col-span-2">
              <h3 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-secondary">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Right-hand column: social proof + rotating review phrases. */}
          <div className="md:col-span-6 lg:col-span-3">
            <FooterSocialProof />
          </div>
        </div>

        {/* Legal strip */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p className="max-w-xl md:text-right">
            Pizza names and prices are as printed on the Waffle Wizard menu card. Ratings, reviews and outlet details are
            indicative sample data pending confirmation by the business.
          </p>
        </div>
      </div>
    </footer>
  );
}
