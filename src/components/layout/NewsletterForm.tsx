"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

/** Captures an email locally for now; POST to your ESP in `onSubmit`. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
  };

  if (done) {
    return (
      <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white" role="status">
        <Check className="size-4 text-secondary" /> You are on the list.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        className="h-12 min-w-0 flex-1 rounded-full border border-white/15 bg-white/8 px-5 text-sm text-white placeholder:text-white/40 focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/25"
      />
      <Button type="submit" variant="gold" size="lg" iconRight={<ArrowRight className="size-4" />}>
        Subscribe
      </Button>
    </form>
  );
}
