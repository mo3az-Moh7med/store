"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { priceItems } from "@/lib/pricing";
import { FREE_SHIPPING_OVER, GOVERNORATES, shippingFee } from "@/lib/shipping";
import { money } from "@/lib/format";

type Field = "name" | "phone" | "governorate" | "city" | "address" | "notes" | "website";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, ready, clear } = useCart();
  const [form, setForm] = useState<Record<Field, string>>({
    name: "",
    phone: "",
    governorate: "",
    city: "",
    address: "",
    notes: "",
    website: "", // حقل مصيدة للبوتات، لازم يفضل فاضي
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!ready || done) return null;

  if (lines.length === 0) {
    return (
      <div className="empty">
        <h1>السلة فاضية</h1>
        <Link href="/#products" className="btn">
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  const priced = priceItems(lines);
  if (!priced.ok) {
    return (
      <div className="empty">
        <p className="alert">{priced.error}</p>
        <Link href="/cart" className="btn">
          ارجع للسلة
        </Link>
      </div>
    );
  }

  const fee = shippingFee(form.governorate, priced.subtotal);
  const total = fee === null ? null : priced.subtotal + fee;

  const set =
    (field: Field) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, paymentMethod: "cod", items: lines }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "حصلت مشكلة، جرب تاني.");
        setBusy(false);
        return;
      }
      setDone(true);
      clear();
      router.push(`/thank-you?order=${data.orderNo}`);
    } catch {
      setError("مفيش اتصال بالإنترنت، جرب تاني.");
      setBusy(false);
    }
  }

  return (
    <div>
      <h1>إتمام الطلب</h1>
      <div className="checkout">
        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="name">الاسم بالكامل</label>
            <input id="name" required autoComplete="name" value={form.name} onChange={set("name")} />
          </div>

          <div className="field">
            <label htmlFor="phone">رقم الموبايل</label>
            <input
              id="phone"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="01xxxxxxxxx"
              value={form.phone}
              onChange={set("phone")}
            />
          </div>

          <div className="two">
            <div className="field">
              <label htmlFor="governorate">المحافظة</label>
              <select id="governorate" required value={form.governorate} onChange={set("governorate")}>
                <option value="">اختار المحافظة</option>
                {GOVERNORATES.map((g) => (
                  <option key={g.name} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">المدينة / المنطقة</label>
              <input id="city" required value={form.city} onChange={set("city")} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="address">العنوان بالتفصيل</label>
            <textarea
              id="address"
              required
              rows={3}
              placeholder="الشارع، رقم العمارة، الدور، الشقة، علامة مميزة"
              value={form.address}
              onChange={set("address")}
            />
          </div>

          <div className="field">
            <label htmlFor="notes">ملاحظات (اختياري)</label>
            <textarea id="notes" rows={2} value={form.notes} onChange={set("notes")} />
          </div>

          <div className="hp" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={set("website")}
            />
          </div>

          <div className="pay-box">الدفع عند الاستلام</div>

          {error && <p className="alert">{error}</p>}

          <button type="submit" className="btn btn-block" disabled={busy}>
            {busy ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
          </button>
        </form>

        <aside className="summary">
          <h2>ملخص الطلب</h2>
          {priced.lines.map((l) => (
            <div className="summary-row" key={`${l.slug}|${l.size}|${l.color}`}>
              <span>
                {l.name} ({l.size} / {l.color}) × {l.qty}
              </span>
              <span>{money(l.lineTotal)}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>إجمالي المنتجات</span>
            <span>{money(priced.subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>الشحن</span>
            <span>{fee === null ? "حسب المحافظة" : fee === 0 ? "مجاني" : money(fee)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>الإجمالي</span>
            <span>{total === null ? "—" : money(total)}</span>
          </div>
          {FREE_SHIPPING_OVER > 0 && (
            <p className="muted">شحن مجاني للطلبات فوق {money(FREE_SHIPPING_OVER)}.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
