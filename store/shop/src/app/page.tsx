import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { STORE_NAME, STORE_TAGLINE } from "@/lib/config";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>{STORE_NAME}</h1>
        <p>{STORE_TAGLINE}. الدفع عند الاستلام وشحن لكل المحافظات.</p>
        <a href="#products" className="btn">
          تسوّق الآن
        </a>
      </section>

      <section id="products">
        <h2 className="section-title">المنتجات</h2>
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
