import { siteConfig } from "@/lib/config/site";

/** wa.me deep link with the brand's prefilled greeting. */
export function whatsappLink(raw: string, message: string = siteConfig.contact.whatsappMessage): string {
  return `https://wa.me/${raw}?text=${encodeURIComponent(message)}`;
}

export const whatsappNumbers = siteConfig.contact.whatsapp.map((line) => ({
  ...line,
  href: whatsappLink(line.raw),
}));
