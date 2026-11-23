// حساب الأسعار: بيتستخدم في الواجهة للعرض، وفي السيرفر كمصدر الحقيقة.
// السيرفر مبيثقش في أي سعر جاي من المتصفح؛ بيحسب من ملف المنتجات.
import { getProduct, getVariant } from "@/data/products";

export type OrderItemInput = { slug: string; size: string; color: string; qty: number };
export type PricedLine = OrderItemInput & { name: string; unitPrice: number; lineTotal: number };
export type PriceResult =
  | { ok: true; lines: PricedLine[]; subtotal: number }
  | { ok: false; error: string };

export function priceItems(items: OrderItemInput[]): PriceResult {
  // ندمج الأسطر المتكررة لنفس المنتج/المقاس/اللون قبل فحص المخزون
  const merged = new Map<string, OrderItemInput>();
  for (const it of items) {
    const key = `${it.slug}|${it.size}|${it.color}`;
    const prev = merged.get(key);
    merged.set(key, prev ? { ...prev, qty: prev.qty + it.qty } : { ...it });
  }

  const lines: PricedLine[] = [];
  for (const it of merged.values()) {
    const product = getProduct(it.slug);
    if (!product) return { ok: false, error: "في منتج في السلة مش موجود." };

    const variant = getVariant(product, it.size, it.color);
    if (!variant) return { ok: false, error: `${product.name}: المقاس أو اللون مش متاح.` };

    if (variant.stock < it.qty) {
      return {
        ok: false,
        error:
          variant.stock > 0
            ? `${product.name} (${it.size} / ${it.color}): المتاح ${variant.stock} قطع بس.`
            : `${product.name} (${it.size} / ${it.color}) خلص.`,
      };
    }

    lines.push({
      ...it,
      name: product.name,
      unitPrice: product.price,
      lineTotal: product.price * it.qty,
    });
  }

  return { ok: true, lines, subtotal: lines.reduce((sum, l) => sum + l.lineTotal, 0) };
}
