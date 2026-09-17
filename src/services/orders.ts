import type {
  Address,
  CartItem,
  ID,
  Order,
  OrderItem,
  OrderStatus,
  OrderTimelineEntry,
  PriceBreakdown,
  ServiceMode,
} from "@/types";

/**
 * Order lifecycle. Currently an in-browser simulation persisted to
 * localStorage so the tracking page can be exercised end to end. The public
 * surface is intentionally shaped like an orders API.
 */

const STORAGE_KEY = "ww:orders";

const DELIVERY_FLOW: OrderStatus[] = ["placed", "preparing", "baking", "out-for-delivery", "delivered"];
const PICKUP_FLOW: OrderStatus[] = ["placed", "preparing", "baking", "ready-for-pickup", "delivered"];

const STEP_COPY: Record<OrderStatus, { label: string; description: string }> = {
  placed: { label: "Order placed", description: "We have your order and the outlet has accepted it." },
  preparing: { label: "Preparing", description: "Dough stretched, sauce and toppings going on." },
  baking: { label: "In the oven", description: "On the stone deck. About 8 minutes at full heat." },
  "out-for-delivery": { label: "Out for delivery", description: "Boxed, sealed and on the way to you." },
  "ready-for-pickup": { label: "Ready for pickup", description: "Boxed and waiting at the counter." },
  delivered: { label: "Delivered", description: "Enjoy. Tell us how it was." },
  cancelled: { label: "Cancelled", description: "This order was cancelled." },
};

/** Minutes after placement at which each step is reached in the simulation. */
const STEP_OFFSETS_MIN = [0, 2, 9, 17, 32];

export function flowFor(mode: ServiceMode): OrderStatus[] {
  return mode === "delivery" ? DELIVERY_FLOW : PICKUP_FLOW;
}

function readAll(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function writeAll(orders: Order[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Storage may be unavailable (private mode); the order still exists in memory.
  }
}

function generateCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "WW-";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function buildTimeline(mode: ServiceMode, placedAt: string): OrderTimelineEntry[] {
  const start = new Date(placedAt).getTime();
  return flowFor(mode).map((status, index) => ({
    status,
    ...STEP_COPY[status],
    at: new Date(start + STEP_OFFSETS_MIN[index] * 60_000).toISOString(),
  }));
}

/** Snapshot cart lines so later catalog edits can't alter a placed order. */
function snapshotItems(items: CartItem[]): OrderItem[] {
  return items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.name,
    image: item.image,
    diet: item.diet,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    variants: item.variants,
    addons: item.addons,
  }));
}

export interface CreateOrderInput {
  items: CartItem[];
  serviceMode: ServiceMode;
  storeId: ID;
  address?: Address;
  pricing: PriceBreakdown;
  couponCode?: string;
  paymentId?: ID;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const placedAt = new Date().toISOString();
  const order: Order = {
    id: `ord_${Date.now().toString(36)}`,
    code: generateCode(),
    items: snapshotItems(input.items),
    status: "placed",
    serviceMode: input.serviceMode,
    storeId: input.storeId,
    address: input.address,
    pricing: input.pricing,
    couponCode: input.couponCode,
    placedAt,
    etaMinutes: input.serviceMode === "delivery" ? 35 : 20,
    timeline: buildTimeline(input.serviceMode, placedAt),
    paymentId: input.paymentId,
  };

  writeAll([order, ...readAll()].slice(0, 20));
  return order;
}

/**
 * Resolves the live status from elapsed time, so the tracking page advances on
 * its own without a websocket. A backend would return `status` directly.
 */
export function deriveStatus(order: Order, now: Date = new Date()): OrderStatus {
  if (order.status === "cancelled") return "cancelled";
  const reached = order.timeline.filter((step) => step.at && new Date(step.at) <= now);
  return reached.length ? reached[reached.length - 1].status : "placed";
}

export async function getOrderByCode(code: string): Promise<Order | undefined> {
  const normalized = code.trim().toUpperCase();
  return readAll().find((order) => order.code === normalized);
}

export async function getRecentOrders(): Promise<Order[]> {
  return readAll();
}

export const orderStepCopy = STEP_COPY;
