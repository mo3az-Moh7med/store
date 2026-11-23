import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cairo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL, STORE_DESCRIPTION, STORE_NAME, STORE_TAGLINE } from "@/lib/config";

const cairo = Cairo({ subsets: ["arabic", "latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${STORE_NAME} | ${STORE_TAGLINE}`, template: `%s | ${STORE_NAME}` },
  description: STORE_DESCRIPTION,
  openGraph: { siteName: STORE_NAME, locale: "ar_EG", type: "website" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <CartProvider>
          <Header />
          <main className="container main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
