"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();

  const firstColor =
    product.colors.find((c) => product.variants.some((v) => v.color === c.name && v.stock > 0))?.name ??
    product.colors[0]?.name ??
    "";

  const [color, setColor] = useState(firstColor);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const sizes = useMemo(() => Array.from(new Set(product.variants.map((v) => v.size))), [product]);
  const stockOf = (s: string, c: string) =>
    product.variants.find((v) => v.size === s && v.color === c)?.stock ?? 0;
  const stock = size ? stockOf(size, color) : 0;
  const maxQty = Math.min(stock, 10);

  function pickColor(c: string) {
    setColor(c);
    if (size && stockOf(size, c) === 0) setSize("");
    setQty(1);
    setAdded(false);
    setError("");
  }

  function pickSize(s: string) {
    setSize(s);
    setQty(1);
    setAdded(false);
    setError("");
  }

  function submit() {
    if (!size) {
      setError("اختار المقاس الأول.");
      return;
    }
    add({ slug: product.slug, size, color, qty });
    setAdded(true);
  }

  const soldOut = !product.variants.some((v) => v.stock > 0);
  if (soldOut) return <p className="alert">المنتج ده خلص حاليًا.</p>;

  return (
    <div className="options">
      {product.colors.length > 1 && (
        <div className="option">
          <div className="option-label">
            اللون: <strong>{color}</strong>
          </div>
          <div className="chips">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                className={`swatch${c.name === color ? " active" : ""}`}
                style={{ background: c.hex }}
                onClick={() => pickColor(c.name)}
                aria-label={c.name}
                title={c.name}
              />
            ))}
          </div>
        </div>
      )}

      <div className="option">
        <div className="option-label">المقاس</div>
        <div className="chips">
          {sizes.map((s) => {
            const available = stockOf(s, color) > 0;
            return (
              <button
                key={s}
                type="button"
                className={`size${s === size ? " active" : ""}`}
                disabled={!available}
                onClick={() => pickSize(s)}
              >
                {s}
              </button>
            );
          })}
        </div>
        {size && stock > 0 && stock <= 3 && <p className="hint">متبقي {stock} قطع بس</p>}
      </div>

      <div className="option">
        <div className="option-label">الكمية</div>
        <div className="qty">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="قلّل">
            −
          </button>
          <span>{qty}</span>
          <button
            type="button"
            onClick={() => setQty(Math.min(Math.max(1, maxQty), qty + 1))}
            aria-label="زوّد"
          >
            +
          </button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <button type="button" className="btn btn-block" onClick={submit}>
        أضف للسلة
      </button>

      {added && (
        <p className="ok">
          تمت الإضافة. <Link href="/cart">روح للسلة</Link>
        </p>
      )}
    </div>
  );
}
