"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { getProduct, getVariant, type Product } from "@/data/products";
import { useCart, type CartLine } from "@/lib/cart";
import { FREE_SHIPPING_OVER } from "@/lib/shipping";
import { money } from "@/lib/format";

type Row = { line: CartLine; product: Product; stock: number };

export default function CartPage() {
  const { lines, ready, setQty, remove } = useCart();

  if (!ready) return null;

  if (lines.length === 0) {
    return (
      <div className="empty">
        <h1>السلة فاضية</h1>
        <p className="muted">ضيف منتجات وارجع هنا.</p>
        <Link href="/#products" className="btn">
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  const rows: Row[] = [];
  const broken: CartLine[] = [];
  for (const line of lines) {
    const product = getProduct(line.slug);
    const variant = product ? getVariant(product, line.size, line.color) : undefined;
    if (product && variant && variant.stock > 0) rows.push({ line, product, stock: variant.stock });
    else broken.push(line);
  }

  const subtotal = rows.reduce((sum, r) => sum + r.product.price * r.line.qty, 0);

  return (
    <div>
      <h1>السلة</h1>

      {rows.map(({ line, product, stock }) => (
        <div className="cart-row" key={`${line.slug}|${line.size}|${line.color}`}>
          <ProductImage product={product} />
          <div>
            <p className="cart-name">{product.name}</p>
            <p className="cart-meta">
              المقاس {line.size} · {line.color}
            </p>
            <div className="qty">
              <button type="button" onClick={() => setQty(line, line.qty - 1)} aria-label="قلّل">
                −
              </button>
              <span>{line.qty}</span>
              <button
                type="button"
                onClick={() => setQty(line, line.qty + 1)}
                disabled={line.qty >= Math.min(stock, 10)}
                aria-label="زوّد"
              >
                +
              </button>
            </div>
            <button type="button" className="link-btn" onClick={() => remove(line)}>
              حذف
            </button>
          </div>
          <strong>{money(product.price * line.qty)}</strong>
        </div>
      ))}

      {broken.map((line) => (
        <div className="cart-row" key={`${line.slug}|${line.size}|${line.color}`}>
          <div className="img placeholder">—</div>
          <div>
            <p className="cart-name">منتج مبقاش متاح</p>
            <p className="cart-meta">
              {line.slug} · {line.size} · {line.color}
            </p>
            <button type="button" className="link-btn" onClick={() => remove(line)}>
              حذف
            </button>
          </div>
          <span />
        </div>
      ))}

      <div className="summary">
        <div className="summary-row">
          <span>إجمالي المنتجات</span>
          <strong>{money(subtotal)}</strong>
        </div>
        <p className="muted">
          مصاريف الشحن بتتحسب في الخطوة الجاية حسب المحافظة
          {FREE_SHIPPING_OVER > 0 && ` (شحن مجاني للطلبات فوق ${money(FREE_SHIPPING_OVER)})`}.
        </p>
        {broken.length > 0 ? (
          <p className="error">احذف المنتجات اللي مبقتش متاحة عشان تكمّل.</p>
        ) : (
          <Link href="/checkout" className="btn btn-block">
            إتمام الطلب
          </Link>
        )}
      </div>
    </div>
  );
}
