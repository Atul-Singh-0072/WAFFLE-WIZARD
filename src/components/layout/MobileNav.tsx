"use client";

import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { SocialIcon } from "@/components/common/SocialIcon";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { primaryNav, socialLinks } from "@/lib/config/nav";
import { isPlaceholder, siteConfig } from "@/lib/config/site";
import { whatsappNumbers } from "@/lib/utils/whatsapp";
import { cn } from "@/lib/utils/cn";
import { getIcon } from "@/lib/utils/icons";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="responsive"
      title={<Logo size="sm" asLink={false} />}
      footer={
        <Button href="/menu" fullWidth size="lg" onClick={onClose} iconRight={<ArrowRight className="size-4" />}>
          Order now
        </Button>
      }
    >
      <nav aria-label="Mobile">
        <ul className="-mx-1 space-y-1">
          {primaryNav.map((item) => {
            const Icon = getIcon(item.icon);
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3.5 rounded-xl px-3 py-3 transition-colors",
                    active ? "bg-primary-50 text-primary-800" : "text-text hover:bg-surface-2",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      active ? "bg-primary text-white" : "bg-surface-2 text-primary-700",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-bold leading-tight">{item.label}</span>
                    {item.description && <span className="block text-xs text-muted">{item.description}</span>}
                  </span>
                  <ChevronRight className="size-4 text-muted" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6 rounded-xl border border-border bg-surface-2/60 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Need help?</p>
        <p className="mt-1.5 text-sm text-text-soft">
          {isPlaceholder(siteConfig.contact.phone) ? (
            <span className="text-muted">{siteConfig.contact.phone}</span>
          ) : (
            <span className="font-semibold text-primary-800">
              <a href={`tel:${siteConfig.contact.phoneRaw}`}>{siteConfig.contact.phone}</a>
              {siteConfig.contact.phone2 && (
                <>
                  {" / "}
                  <a href={`tel:${siteConfig.contact.phone2Raw}`}>{siteConfig.contact.phone2}</a>
                </>
              )}
            </span>
          )}
          <span className="text-muted"> · {siteConfig.contact.hours}</span>
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">WhatsApp</span>
          {whatsappNumbers.map((line) => (
            <a
              key={line.raw}
              href={line.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1 rounded-full bg-[#25d366] px-3 text-xs font-bold text-[#062b16]"
            >
              <SocialIcon name="Whatsapp" width={13} height={13} />
              {line.display}
            </a>
          ))}
        </p>
        <div className="mt-3 flex gap-2">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={isPlaceholder(social.href) ? "#" : social.href}
              aria-label={social.label}
              aria-disabled={isPlaceholder(social.href)}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-surface text-text-soft hover:border-primary-300 hover:text-primary-800"
            >
              <SocialIcon name={social.icon} width={17} height={17} />
            </a>
          ))}
        </div>
      </div>
    </Drawer>
  );
}
