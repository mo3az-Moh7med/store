import Link from "next/link";
import { STORE_NAME, WHATSAPP_NUMBER } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong>{STORE_NAME}</strong>
          <p className="muted">الدفع عند الاستلام · شحن لكل المحافظات</p>
        </div>
        <div className="footer-links">
          <Link href="/policies#returns">الاسترجاع والاستبدال</Link>
          <Link href="/policies#shipping">الشحن</Link>
          <Link href="/policies#privacy">الخصوصية</Link>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
            واتساب
          </a>
        </div>
      </div>
      <p className="copy">© {new Date().getFullYear()} {STORE_NAME}</p>
    </footer>
  );
}
