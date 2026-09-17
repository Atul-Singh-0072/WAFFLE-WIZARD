/**
 * LEGAL PLACEHOLDERS.
 *
 * These pages exist so navigation, sitemap and footer links resolve. Every
 * section body is a bracketed placeholder — do not publish until counsel has
 * supplied the actual text. Replace here; the route renders whatever is below.
 */

export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalDocument {
  slug: string;
  title: string;
  summary: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export const legalDocuments: LegalDocument[] = [
  {
    slug: "refund-policy",
    title: "Refund policy",
    summary: "When and how refunds are issued for delivery, pickup and dine-in orders.",
    lastUpdated: "[DATE]",
    sections: [
      { heading: "Eligibility", body: "[REFUND ELIGIBILITY TERMS TO BE SUPPLIED BY THE BUSINESS]" },
      { heading: "How to raise a refund request", body: "[REFUND PROCESS TO BE SUPPLIED BY THE BUSINESS]" },
      { heading: "Timelines", body: "[REFUND TIMELINES TO BE SUPPLIED BY THE BUSINESS]" },
      { heading: "Cancellations", body: "[CANCELLATION TERMS TO BE SUPPLIED BY THE BUSINESS]" },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy policy",
    summary: "What we collect when you order, why, and how long we keep it.",
    lastUpdated: "[DATE]",
    sections: [
      { heading: "Information we collect", body: "[PRIVACY CONTENT TO BE SUPPLIED BY THE BUSINESS]" },
      { heading: "How we use it", body: "[PRIVACY CONTENT TO BE SUPPLIED BY THE BUSINESS]" },
      { heading: "Location data", body: "[PRIVACY CONTENT TO BE SUPPLIED BY THE BUSINESS]" },
      { heading: "Your rights", body: "[PRIVACY CONTENT TO BE SUPPLIED BY THE BUSINESS]" },
      { heading: "Contact", body: "[DATA CONTACT DETAILS TO BE SUPPLIED BY THE BUSINESS]" },
    ],
  },
  {
    slug: "terms",
    title: "Terms & conditions",
    summary: "The agreement that applies when you use this site and place an order.",
    lastUpdated: "[DATE]",
    sections: [
      { heading: "Using the site", body: "[TERMS CONTENT TO BE SUPPLIED BY THE BUSINESS]" },
      { heading: "Orders and pricing", body: "[TERMS CONTENT TO BE SUPPLIED BY THE BUSINESS]" },
      { heading: "Promotions", body: "[TERMS CONTENT TO BE SUPPLIED BY THE BUSINESS]" },
      { heading: "Liability", body: "[TERMS CONTENT TO BE SUPPLIED BY THE BUSINESS]" },
      { heading: "Governing law", body: "[TERMS CONTENT TO BE SUPPLIED BY THE BUSINESS]" },
    ],
  },
];
