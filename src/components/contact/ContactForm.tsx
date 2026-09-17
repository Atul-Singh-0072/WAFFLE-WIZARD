"use client";

import { Check, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";

const topics = [
  { value: "general", label: "General question" },
  { value: "order", label: "About an order" },
  { value: "feedback", label: "Feedback" },
  { value: "franchise", label: "Franchise enquiry" },
  { value: "partnership", label: "Partner with us" },
  { value: "careers", label: "Careers" },
  { value: "bulk", label: "Bulk & corporate orders" },
];

/** Stores the submission locally for now — swap `submit` for a POST to your CRM or email service. */
export function ContactForm() {
  const params = useSearchParams();
  const initialTopic = topics.some((t) => t.value === params.get("topic")) ? params.get("topic")! : "general";

  const [form, setForm] = useState({ name: "", phone: "", email: "", topic: initialTopic, message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Enter your name.";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, "")) && !form.email) e.phone = "Enter a phone number or an email.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "That email does not look right.";
    if (form.message.trim().length < 10) e.message = "Tell us a little more.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="py-8 text-center" role="status">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success text-white">
          <Check className="size-7" strokeWidth={3} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-bold text-text">Message received</h2>
        <p className="mt-2 text-sm text-muted">Thanks, {form.name.split(" ")[0]}. We will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-text">Send a message</h2>
        <p className="mt-1 text-sm text-muted">Fields marked * are required.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" error={errors.name} />
        <Select label="Topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
          {topics.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
        <Input label="Phone" type="tel" inputMode="numeric" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel-national" error={errors.phone} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" error={errors.email} />
        <Textarea label="Message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} error={errors.message} wrapperClassName="sm:col-span-2" />
      </div>
      <Button type="submit" size="lg" iconRight={<Send className="size-4" />}>
        Send message
      </Button>
    </form>
  );
}
