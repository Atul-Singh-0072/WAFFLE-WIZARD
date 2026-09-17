"use client";

import { ArrowRight, LocateFixed, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { Reveal } from "@/components/common/Reveal";
import { StoreCard } from "@/components/stores/StoreCard";
import { StoreMapLoader } from "@/components/stores/StoreMapLoader";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { withDistance } from "@/lib/utils/geo";
import { useLocation } from "@/store/location-store";
import type { Store } from "@/types";

export function StoreLocatorPreview({ stores }: { stores: Store[] }) {
  const router = useRouter();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [hoverId, setHoverId] = useState<string | undefined>();

  const ordered = useMemo(
    () => (location.coords ? withDistance(stores, location.coords) : stores),
    [stores, location.coords],
  );
  const shortlist = ordered.slice(0, 3);
  const single = stores.length === 1;

  // Explicit hover wins; otherwise the chosen outlet; otherwise the first card.
  const activeId = hoverId ?? location.storeId ?? shortlist[0]?.id;
  const setActiveId = (id: string) => setHoverId(id);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    router.push(query.trim() ? `/stores?q=${encodeURIComponent(query.trim())}` : "/stores");
  };

  return (
    <section className="section-y bg-surface" aria-labelledby="stores-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow={single ? "Find us" : "Outlets"}
            title={<span id="stores-heading">{single ? `Visit us in ${stores[0].locality}` : "Find your nearest outlet"}</span>}
            description={
              single
                ? `One outlet, in ${stores[0].locality}, ${stores[0].city}. Check opening hours and services, see if we deliver to you, and get directions.`
                : "Search by locality or pincode, or let the browser find you. Every outlet lists what it offers and when it is open."
            }
            action={
              <Button href={single ? `/stores/${stores[0].slug}` : "/stores"} variant="outline" size="md" iconRight={<ArrowRight className="size-4" />}>
                {single ? "Store details" : "All outlets"}
              </Button>
            }
          />
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <form onSubmit={onSubmit} className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <label htmlFor="store-search" className="sr-only">
                  Search outlets
                </label>
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  id="store-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="City, locality or pincode"
                  className="h-12 w-full rounded-full border-[1.5px] border-border bg-surface pl-11 pr-4 text-[15px] text-text placeholder:text-muted/80 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </div>
              <Button type="submit" variant="secondary" size="lg">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                aria-label="Use my location"
                onClick={() => location.locate()}
                loading={location.status === "locating"}
              >
                <LocateFixed className="size-4" />
              </Button>
            </form>

            <ul className="mt-4 space-y-3">
              {shortlist.map((store) => (
                <li key={store.id}>
                  <StoreCard store={store} compact active={store.id === activeId} onSelect={(s) => setActiveId(s.id)} />
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="h-[22rem] overflow-hidden rounded-2xl border border-border shadow-md lg:h-full lg:min-h-[34rem]">
              <StoreMapLoader
                stores={ordered}
                activeId={activeId}
                onSelect={(store) => setActiveId(store.id)}
                userPosition={location.coords}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
