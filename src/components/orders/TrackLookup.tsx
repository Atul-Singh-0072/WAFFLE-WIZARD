"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { formatDateTime, formatPrice, orderStatusLabels } from "@/lib/utils/format";
import { deriveStatus, getRecentOrders } from "@/services/orders";
import type { Order } from "@/types";

export function TrackLookup() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [recent, setRecent] = useState<Order[]>([]);

  useEffect(() => {
    getRecentOrders().then(setRecent);
  }, []);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (code.trim()) router.push(`/track/${code.trim().toUpperCase()}`);
  };

  return (
    <div className="container-page grid gap-10 pb-16 pt-8 lg:grid-cols-12">
      <form onSubmit={onSubmit} className="lg:col-span-5">
        <Input
          label="Order code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="WW-XXXXXX"
          iconLeft={<Search className="size-4" />}
          autoComplete="off"
          autoCapitalize="characters"
        />
        <Button type="submit" size="lg" className="mt-4" iconRight={<ArrowRight className="size-4" />} disabled={!code.trim()}>
          Track order
        </Button>
      </form>

      <section className="lg:col-span-7" aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="font-display text-lg font-bold text-text">
          Recent orders on this device
        </h2>
        {recent.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No orders yet. Once you place one, it will show up here.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-surface">
            {recent.map((order) => (
              <li key={order.id}>
                <Link href={`/track/${order.code}`} className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-2">
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base font-bold text-text">{order.code}</span>
                    <span className="block text-xs text-muted">
                      {formatDateTime(order.placedAt)} · {order.items.length} {order.items.length === 1 ? "item" : "items"} · {formatPrice(order.pricing.total)}
                    </span>
                  </span>
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-800">{orderStatusLabels[deriveStatus(order)]}</span>
                  <ArrowRight className="size-4 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
