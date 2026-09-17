import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/common/JsonLd";
import { PageHeader } from "@/components/common/PageHeader";
import { StoreActions } from "@/components/stores/StoreActions";
import { StoreCard } from "@/components/stores/StoreCard";
import { StoreMapLoader } from "@/components/stores/StoreMapLoader";
import { StoreStatusPill } from "@/components/stores/StoreStatusPill";
import { WeeklyHours } from "@/components/stores/WeeklyHours";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BLUR_DATA_URL } from "@/data/media";
import { isPlaceholder, siteConfig } from "@/lib/config/site";
import { formatStoreAddress, serviceModeLabels } from "@/lib/utils/format";
import { withDistance } from "@/lib/utils/geo";
import { breadcrumbSchema, buildMetadata, localBusinessSchema } from "@/lib/seo";
import { getStoreBySlug, getStoreSlugs, getStores } from "@/services/stores";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getStoreSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return { title: "Not found" };
  return buildMetadata({
    title: `${store.name} — pizza ${store.services.map((s) => serviceModeLabels[s].toLowerCase()).join(", ")} in ${store.locality}`,
    description: `${siteConfig.name} ${store.locality}, ${store.city}. Opening hours, services and directions. Order pizza for ${store.services.map((s) => serviceModeLabels[s].toLowerCase()).join(" or ")}.`,
    path: `/stores/${store.slug}`,
    image: store.image,
  });
}

export default async function StorePage({ params }: Params) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const all = await getStores();
  const nearby = withDistance(
    all.filter((s) => s.id !== store.id && s.status === "live"),
    { latitude: store.latitude, longitude: store.longitude },
  ).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          localBusinessSchema(store),
          breadcrumbSchema([
            { name: "Stores", path: "/stores" },
            { name: store.locality, path: `/stores/${store.slug}` },
          ]),
        ]}
      />

      <PageHeader
        tone="dark"
        eyebrow={`${store.city} · ${store.pincode}`}
        title={store.locality}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <StoreStatusPill store={store} showNext className="text-sm [&>span:first-child]:size-2" />
            <span className="text-white/50">·</span>
            <span>{store.services.map((s) => serviceModeLabels[s]).join(" · ")}</span>
          </span>
        }
        crumbs={[{ label: "Stores", href: "/stores" }, { label: store.locality }]}
        aside={<StoreActions store={store} />}
      />

      <div className="container-page grid gap-8 py-8 lg:grid-cols-12 lg:gap-12 lg:py-12">
        <div className="space-y-8 lg:col-span-7">
          {store.image && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-surface-2 shadow-md">
              <Image src={store.image} alt={`${store.name}`} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
              {store.status === "coming-soon" && (
                <Badge tone="gold" size="md" className="absolute left-4 top-4">
                  Opening soon
                </Badge>
              )}
            </div>
          )}

          <section aria-labelledby="hours-heading" className="rounded-2xl border border-border bg-surface p-5 md:p-6">
            <h2 id="hours-heading" className="font-display text-xl font-bold text-text">
              Opening hours
            </h2>
            <WeeklyHours hours={store.openingHours} />
          </section>

          <section aria-labelledby="services-heading" className="rounded-2xl border border-border bg-surface p-5 md:p-6">
            <h2 id="services-heading" className="font-display text-xl font-bold text-text">
              Services at this outlet
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {(["delivery", "pickup", "dine-in"] as const).map((mode) => {
                const offered = store.services.includes(mode);
                return (
                  <li key={mode} className={`rounded-xl border p-4 ${offered ? "border-primary-100 bg-primary-50/50" : "border-border bg-surface-2/40 opacity-60"}`}>
                    <p className="font-semibold text-text">{serviceModeLabels[mode]}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {offered
                        ? mode === "delivery"
                          ? `Within ${store.deliveryRadiusKm} km`
                          : mode === "pickup"
                            ? "Order ahead, collect at the counter"
                            : "Walk in or reserve at checkout"
                        : "Not available here"}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="font-display text-lg font-bold text-text">Address & contact</h2>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-text-soft">{formatStoreAddress(store, { withState: true })}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-primary" />
                {isPlaceholder(store.phone) ? <span className="text-muted">{store.phone}</span> : <a href={`tel:${store.phone}`} className="font-semibold text-primary-800 hover:underline">{store.phone}</a>}
              </li>
              {store.email && (
                <li className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-primary" />
                  <a href={`mailto:${store.email}`} className="text-primary-800 hover:underline">
                    {store.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="h-72 overflow-hidden rounded-2xl border border-border shadow-md">
            <StoreMapLoader stores={[store]} activeId={store.id} interactive={false} />
          </div>
        </aside>
      </div>

      {nearby.length > 0 && (
        <section className="section-y border-t border-border bg-surface" aria-labelledby="nearby-heading">
          <div className="container-page">
            <SectionHeading eyebrow="Nearby" title={<span id="nearby-heading">Other outlets close to {store.locality}</span>} />
            <ul className="grid gap-4 md:grid-cols-3">
              {nearby.map((s) => (
                <li key={s.id}>
                  <StoreCard store={s} compact />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
