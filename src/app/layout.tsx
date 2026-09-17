import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { BrandIntro } from "@/components/common/BrandIntro";
import { BRAND_INTRO_BOOT } from "@/components/common/brand-intro-boot";
import { THEME_BOOT } from "@/lib/theme";
import { JsonLd } from "@/components/common/JsonLd";
import { Providers } from "@/components/common/Providers";
import { WaffleZonePopup } from "@/components/common/WaffleZonePopup";
import { WhatsAppFab } from "@/components/common/WhatsAppFab";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { siteConfig } from "@/lib/config/site";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { media } from "@/data/media";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz", "wdth"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.seo.keywords],
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: media.pizza.cheesyBlast, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [media.pizza.cheesyBlast],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d0810",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${bricolage.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        {/*
          Boot script for the intro splash. Wrapped in a hidden div via innerHTML so the
          parser executes it from the streamed HTML (before first paint, in dev and prod)
          while React never creates a <script> element on the client — avoiding React 19's
          "script tag while rendering" warning during HMR. next/script's beforeInteractive
          is deferred ~1.5s in Turbopack dev, which would flash the page before the splash.
        */}
        <div hidden aria-hidden dangerouslySetInnerHTML={{ __html: `<script>${THEME_BOOT}${BRAND_INTRO_BOOT}</script>` }} />
        <BrandIntro />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Providers>
          <Header />
          <main id="main" className="flex-1 pb-[calc(var(--mobilebar-h)+env(safe-area-inset-bottom))] lg:pb-0">
            {children}
          </main>
          <Footer />
          <MobileBottomBar />
          <CartDrawer />
          <WaffleZonePopup />
          <WhatsAppFab />
        </Providers>
      </body>
    </html>
  );
}
