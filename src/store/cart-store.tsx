"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { cartCount, cartSubtotal } from "@/services/pricing";
import { createPersistedStore, usePersistedStore } from "@/store/persisted-store";
import type { CartItem, ID } from "@/types";

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

interface CartState {
  items: CartItem[];
  couponCode?: string;
}

const cartStore = createPersistedStore<CartState>("ww:cart", { items: [] });

/** Two lines merge only when product and every chosen option match. */
function configKey(item: Pick<CartItem, "productId" | "variants" | "addons">): string {
  const ids = [
    ...item.variants.map((v) => `${v.groupId}:${v.optionId}`),
    ...item.addons.map((a) => `${a.groupId}:${a.optionId}`),
  ].sort();
  return `${item.productId}|${ids.join(",")}`;
}

function addLine(state: CartState, item: Omit<CartItem, "id">): CartState {
  const key = configKey(item);
  const existing = state.items.find((line) => configKey(line) === key);
  if (existing) {
    return {
      ...state,
      items: state.items.map((line) =>
        line.id === existing.id ? { ...line, quantity: line.quantity + item.quantity } : line,
      ),
    };
  }
  const id = `line_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  return { ...state, items: [...state.items, { ...item, id }] };
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

interface CartContextValue extends CartState {
  /** False during SSR and hydration; true once persisted state is live. */
  hydrated: boolean;
  count: number;
  subtotal: number;
  isOpen: boolean;
  /** Timestamp of the most recent add, for badge pop animations. */
  lastAddedAt: number;
  addItem: (item: Omit<CartItem, "id">, options?: { openDrawer?: boolean }) => void;
  setQuantity: (id: ID, quantity: number) => void;
  removeItem: (id: ID) => void;
  setCoupon: (code?: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const state = usePersistedStore(cartStore);
  const hydrated = useMounted();
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState(0);

  const addItem = useCallback<CartContextValue["addItem"]>((item, options) => {
    cartStore.set((current) => addLine(current, item));
    setLastAddedAt(Date.now());
    if (options?.openDrawer) setIsOpen(true);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      hydrated,
      count: cartCount(state.items),
      subtotal: cartSubtotal(state.items),
      isOpen,
      lastAddedAt,
      addItem,
      setQuantity: (id, quantity) =>
        cartStore.set((current) => ({
          ...current,
          items:
            quantity <= 0
              ? current.items.filter((line) => line.id !== id)
              : current.items.map((line) => (line.id === id ? { ...line, quantity } : line)),
        })),
      removeItem: (id) =>
        cartStore.set((current) => ({ ...current, items: current.items.filter((line) => line.id !== id) })),
      setCoupon: (code) => cartStore.set((current) => ({ ...current, couponCode: code })),
      clear: () => cartStore.set({ items: [] }),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((current) => !current),
    }),
    [state, hydrated, isOpen, lastAddedAt, addItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
