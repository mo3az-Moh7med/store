import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import Gallery from "@/components/Gallery";
import { getProduct, products, totalStock } from "@/data/products";
import { SITE_URL } from "@/lib/config";
import { money } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: product.images },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  // بيانات منظمة (JSON-LD) عشان جوجل يعرض السعر والتوفر في نتائج البحث
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((src) => `${SITE_URL}${src}`),
    offers: {
      "@type": "Offer",
      priceCurrency: "EGP",
      price: product.price,
      availability:
        totalStock(product) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product.slug}`,
    },
  };

  return (
    <div className="product">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Gallery images={product.images} name={product.name} />
      <div>
        <p className="muted">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="product-price">
          <strong>{money(product.price)}</strong>
          {product.compareAtPrice && <s>{money(product.compareAtPrice)}</s>}
        </p>
        <p>{product.description}</p>
        <AddToCart product={product} />
      </div>
    </div>
  );
}
