import type { Metadata } from "next";
import Link from "next/link";
import { WHATSAPP_NUMBER } from "@/lib/config";

export const metadata: Metadata = { title: "تم استلام طلبك", robots: { index: false } };

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const orderNo = order && /^\d{1,10}$/.test(order) ? order : null;

  return (
    <div className="center">
      <div className="big-check">✓</div>
      <h1>تم استلام طلبك</h1>
      {orderNo && (
        <p>
          رقم الطلب: <strong>#{orderNo}</strong>
        </p>
      )}
      <p className="muted">هنكلمك على رقم الموبايل لتأكيد الطلب قبل الشحن. الدفع عند الاستلام.</p>
      <p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}${orderNo ? `?text=${encodeURIComponent(`أهلًا، بخصوص طلبي رقم ${orderNo}`)}` : ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          كلمنا على واتساب
        </a>
      </p>
      <p>
        <Link href="/">كمّل تسوّق</Link>
      </p>
    </div>
  );
}
