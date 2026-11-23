"use client";

// السلة: محفوظة في localStorage عشان متضيعش لو العميل قفل الصفحة.
// بنخزن (المنتج، المقاس، اللون، الكمية) بس؛ الأسعار بتتجاب من ملف المنتجات.
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { getProduct, getVariant } from "@/data/products";

export type CartLine = { slug: string; size: string; color: string; qty: number };
type Key = Pick<CartLine, "slug" | "size" | "color">;

type Action =
  | { type: "load"; lines: CartLine[] }
  | { type: "add"; line: CartLine }
  | { type: "setQty"; key: Key; qty: number }
  | { type: "remove"; key: Key }
  | { type: "clear" };

const STORAGE_KEY = "cart:v1";
const MAX_PER_LINE = 10;

const same = (a: Key, b: Key) => a.slug === b.slug && a.size === b.size && a.color === b.color;

function maxQty(k: Key): number {
  const product = getProduct(k.slug);
  const variant = product ? getVariant(product, k.size, k.color) : undefined;
  return Math.max(0, Math.min(variant?.stock ?? 0, MAX_PER_LINE));
}

function isLine(x: unknown): x is CartLine {
  if (typeof x !== "object" || x === null) return false;
  const l = x as Record<string, unknown>;
  return (
    typeof l.slug === "string" &&
    typeof l.size === "string" &&
    typeof l.color === "string" &&
    typeof l.qty === "number" &&
    l.qty >= 1
  );
}

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "load":
      return action.lines;
    case "add": {
      const limit = maxQty(action.line);
      if (limit === 0) return state;
      const exists = state.some((l) => same(l, action.line));
      if (exists) {
        return state.map((l) =>
          same(l, action.line) ? { ...l, qty: Math.min(l.qty + action.line.qty, limit) } : l,
        );
      }
      return [...state, { ...action.line, qty: Math.min(action.line.qty, limit) }];
    }
    case "setQty": {
      const limit = Math.max(1, maxQty(action.key));
      const qty = Math.min(Math.max(1, action.qty), limit);
      return state.map((l) => (same(l, action.key) ? { ...l, qty } : l));
    }
    case "remove":
      return state.filter((l) => !same(l, action.key));
    case "clear":
      return [];
  }
}

type CartCtx = {
  lines: CartLine[];
  /** false لحد ما نقرا السلة من localStorage (عشان منعرضش "السلة فاضية" بالغلط) */
  ready: boolean;
  count: number;
  add: (line: CartLine) => void;
  setQty: (key: Key, qty: number) => void;
  remove: (key: Key) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) dispatch({ type: "load", lines: parsed.filter(isLine) });
      }
    } catch {
      /* لو التخزين مش شغال بنكمل بسلة فاضية */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, ready]);

  const value = useMemo<CartCtx>(
    () => ({
      lines,
      ready,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      add: (line) => dispatch({ type: "add", line }),
      setQty: (key, qty) => dispatch({ type: "setQty", key, qty }),
      remove: (key) => dispatch({ type: "remove", key }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [lines, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart لازم يتستخدم جوه CartProvider");
  return ctx;
}
