"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { STORE_NAME } from "@/lib/config";

export default function Header() {
  const { count } = useCart();
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          {STORE_NAME}
        </Link>
        <nav className="nav">
          <Link href="/#products">المنتجات</Link>
          <Link href="/cart">
            السلة
            {count > 0 && <span className="badge">{count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
