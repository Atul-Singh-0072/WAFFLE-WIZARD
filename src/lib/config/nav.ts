import { siteConfig } from "@/lib/config/site";

export interface NavItem {
  label: string;
  href: string;
  /** lucide-react icon name, used by the mobile drawer and bottom bar. */
  icon?: string;
  description?: string;
}

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Menu", href: "/menu", icon: "UtensilsCrossed", description: "Pizzas, sides & combos" },
  { label: "Stores", href: "/stores", icon: "MapPin", description: "Find an outlet near you" },
  { label: "Offers", href: "/offers", icon: "Tag", description: "Deals & promo codes" },
  { label: "About", href: "/about", icon: "Sparkles", description: "The brand story" },
  { label: "Contact", href: "/contact", icon: "MessageCircle", description: "Talk to the team" },
];

/** Four destinations for the mobile bottom bar; the cart is rendered separately. */
export const mobileBottomNav: NavItem[] = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Menu", href: "/menu", icon: "UtensilsCrossed" },
  { label: "Stores", href: "/stores", icon: "MapPin" },
  { label: "Offers", href: "/offers", icon: "Tag" },
];

export interface FooterColumn {
  title: string;
  links: NavItem[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Menu", href: "/menu" },
      { label: "Stores", href: "/stores" },
      { label: "Offers", href: "/offers" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Customer support",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Contact us", href: "/contact" },
      { label: "Track your order", href: "/track" },
      { label: "Refund policy", href: "/legal/refund-policy" },
      { label: "Privacy policy", href: "/legal/privacy-policy" },
      { label: "Terms & conditions", href: "/legal/terms" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "Franchise enquiry", href: "/contact?topic=franchise" },
      { label: "Partner with us", href: "/contact?topic=partnership" },
      { label: "Careers", href: "/contact?topic=careers" },
      { label: "Bulk & corporate orders", href: "/contact?topic=bulk" },
    ],
  },
];

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: siteConfig.social.instagram, icon: "Instagram" },
  { label: "Facebook", href: siteConfig.social.facebook, icon: "Facebook" },
  { label: "YouTube", href: siteConfig.social.youtube, icon: "Youtube" },
];
