import Link from "next/link";

export default function NotFound() {
  return (
    <div className="center">
      <h1>الصفحة مش موجودة</h1>
      <p className="muted">يمكن المنتج اتشال أو الرابط غلط.</p>
      <Link href="/" className="btn">
        الرئيسية
      </Link>
    </div>
  );
}
