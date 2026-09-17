import { siteConfig } from "@/lib/config/site";
import type { PaymentMethodOption, ServiceMode } from "@/types";

/** Icon names resolve against lucide-react at render time. */
export interface ValueProp {
  icon: string;
  title: string;
  description: string;
}

/**
 * The six promises printed on the menu card. Nothing here goes beyond what
 * the business states on its own poster.
 */
export const valueProps: ValueProp[] = [
  {
    icon: "Salad",
    title: "Real ingredients, real taste",
    description: "Vegetables are cut and cheese is grated in-outlet each day. What is on the card is what goes on the base.",
  },
  {
    icon: "Flame",
    title: "Freshly baked, always",
    description: "Nothing is baked ahead. Your pizza goes into the oven after you order it and comes out hot for the box.",
  },
  {
    icon: "Leaf",
    title: "100% veg",
    description: "The whole menu is vegetarian — paneer, cheese, capsicum, onion, tomato, mushroom, corn, olives and jalapeños.",
  },
  {
    icon: "ShieldCheck",
    title: "Hygienic preparation",
    description: "Clean prep counters, gloved hands and sealed boxes — on every single order.",
  },
  {
    icon: "Star",
    title: "Premium quality",
    description: "Good mozzarella, slow-cooked sauce and a dough that is rested rather than rushed.",
  },
  {
    icon: "Timer",
    title: "Made to order",
    description: "Expect about 15 minutes in the kitchen. We show you the clock on the tracking page.",
  },
];

export interface ServiceModeContent {
  mode: ServiceMode;
  icon: string;
  title: string;
  description: string;
  prompt: string;
}

export const serviceModes: ServiceModeContent[] = [
  { mode: "delivery", icon: "Bike", title: "Delivery", description: "Brought to your door from the nearest outlet.", prompt: "Where should we deliver?" },
  { mode: "pickup", icon: "ShoppingBag", title: "Pickup", description: "Order ahead, collect when it is boxed and ready.", prompt: "Which outlet will you collect from?" },
  { mode: "dine-in", icon: "UtensilsCrossed", title: "Dine-in", description: "Reserve a table and order from your seat.", prompt: "Which outlet are you visiting?" },
];

/* ------------------------------------------------------------------ */
/* Brand story                                                         */
/* ------------------------------------------------------------------ */

export const brandStory = {
  eyebrow: "Our story",
  heading: "Good food. Good mood. Magic in every bite.",
  /** Positioning only — no invented history, founders or milestones. */
  paragraphs: [
    "Waffle Wizard is a vegetarian pizza brand built around one idea: real ingredients, real taste, always. Every pizza on the card — classic, premium or signature — is baked fresh after you order it.",
    "The menu is short on purpose. Fourteen pizzas, four combos and a choco pizza, each priced exactly as printed on our card, so what you see online is what you pay at the counter.",
    "The waffles the Wizard is famous for are next. The Waffle Zone is being perfected in the kitchen and will be announced when it is ready — not before.",
  ],
  /** Replace with confirmed company details. */
  facts: [
    { label: "Founded", value: siteConfig.foundedYear },
    { label: "Head office", value: `${siteConfig.headOffice.line1}, ${siteConfig.headOffice.city}, ${siteConfig.headOffice.state}` },
    { label: "Outlets trading", value: "1 — Aliganj, Lucknow" },
    { label: "Founders", value: siteConfig.founders.join(" & ") },
  ],
  phases: [
    {
      phase: "Phase 1",
      status: "live" as const,
      title: "Pizza",
      description: "Classic, premium and signature pizzas, magical combos and choco pizza. Live now at our Aliganj, Lucknow outlet.",
    },
    {
      phase: "Phase 2",
      status: "in-development" as const,
      title: "Waffle Zone",
      description: "Belgian-style waffles — classic, premium, fruit and savoury. Recipes in testing with the kitchen team.",
    },
    {
      phase: "Phase 3",
      status: "planned" as const,
      title: "Specials & seasonal",
      description: "Limited-run creations and festival boxes, released a few times a year alongside the core menu.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    title: "Ordering",
    items: [
      {
        question: "How do I place an order?",
        answer:
          "Pick delivery, pickup or dine-in at the top of the home page, set your location so we can match you to the nearest outlet, then add pizzas from the menu and check out. You can order without creating an account.",
      },
      {
        question: "Can I choose the size?",
        answer:
          "Yes. Every pizza comes in Regular (6\"), Medium (9\") and Large (12\"), priced exactly as on our menu card. Pick the size on the card or on the pizza's page, then add extras such as extra cheese, jalapeños, olives, mushroom or paneer.",
      },
      {
        question: "Are the prices the same as the menu card?",
        answer: "Yes. Every name and price on this site is copied from the printed Waffle Wizard menu card.",
      },
      {
        question: "Do you take orders for large groups?",
        answer:
          "The Family Combo and Pizza Party Combo cover most gatherings. For bulk or corporate orders, contact us directly so the kitchen can plan capacity.",
      },
    ],
  },
  {
    title: "Delivery & pickup",
    items: [
      {
        question: "How long does delivery take?",
        answer: "Kitchen time is typically about 15 minutes, plus travel from the outlet to you. Your live estimate is shown on the order tracking page once the order is placed.",
      },
      {
        question: "What is the delivery charge?",
        answer: "A flat delivery fee applies per order and is shown in your cart before you pay. It is waived automatically on orders above ₹499.",
      },
      {
        question: "Do you deliver to my area?",
        answer: "Our Aliganj outlet delivers within a radius around it. Enter your location on the home page or use the store locator, and we will tell you whether your address is covered.",
      },
    ],
  },
  {
    title: "Menu & ingredients",
    items: [
      {
        question: "Is everything vegetarian?",
        answer: "Yes — the whole menu is 100% vegetarian. There is no chicken, meat, fish or egg anywhere on the card, and every item carries the green veg indicator.",
      },
      {
        question: "Do you have allergen information?",
        answer: "Each pizza lists its ingredients on its page. For specific allergen questions, contact the outlet before ordering so the kitchen can confirm.",
      },
      {
        question: "When is the Waffle Zone launching?",
        answer: "Waffles are coming soon and are not orderable yet. They are marked coming soon across the site so there is no confusion about what is available today.",
      },
    ],
  },
  {
    title: "Payments & refunds",
    items: [
      {
        question: "Which payment methods do you accept?",
        answer: "Online payment methods and cash on delivery are being enabled outlet by outlet. The checkout page shows exactly which options are active for your selected outlet.",
      },
      {
        question: "How do refunds work?",
        answer: "Refund timelines and eligibility are set out in our refund policy. If something is wrong with an order, contact the outlet or our support line on the same day.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Founders                                                            */
/* ------------------------------------------------------------------ */

/**
 * One card, one photograph of both founders, names beside it. Role wording is
 * the business's own ("Co-Founders"); nothing else is asserted about them.
 */
export const foundersCard = {
  photo: "/founders/founders.jpg",
  /** Original photo dimensions, for the modal's intrinsic sizing. */
  photoWidth: 934,
  photoHeight: 1400,
  names: siteConfig.founders,
  role: "Co-Founders",
};

/* ------------------------------------------------------------------ */
/* Footer review ticker                                                */
/* ------------------------------------------------------------------ */

/**
 * Short, unattributed food-review phrases supplied by the business for the
 * footer ticker. No names, dates or ratings are attached, so nothing here
 * reads as a specific customer's review.
 */
export const customerQuotes: string[] = [
  "Great Pizza! 🍕",
  "Really Good Pizza!",
  "Nice Taste!",
  "Loved the Taste!",
  "Absolutely Delicious!",
  "Fresh & Tasty!",
];

/* ------------------------------------------------------------------ */
/* Payments                                                            */
/* ------------------------------------------------------------------ */

export const paymentMethods: PaymentMethodOption[] = [
  { id: "cod", name: "Cash on delivery", description: "Pay the rider when your order arrives.", icon: "Banknote", enabled: true },
  { id: "upi", name: "UPI", description: "GPay, PhonePe, Paytm and any UPI app.", icon: "Smartphone", enabled: false, disabledReason: "Awaiting UPI merchant setup" },
  { id: "razorpay", name: "Cards & netbanking", description: "Secured by Razorpay.", icon: "CreditCard", enabled: false, disabledReason: "Awaiting Razorpay API key" },
  { id: "stripe", name: "International cards", description: "Secured by Stripe.", icon: "Globe", enabled: false, disabledReason: "Awaiting Stripe API key" },
];
