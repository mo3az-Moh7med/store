import Link from "next/link";
import { totalStock, type Product } from "@/data/products";
import { money } from "@/lib/format";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const soldOut = totalStock(product) === 0;
  return (
    <Link href={`/products/${product.slug}`} className="card">
      <div className="card-media">
        <ProductImage product={product} />
        {soldOut && <span className="tag">خلص</span>}
      </div>
      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>
        <p className="price">
          <strong>{money(product.price)}</strong>
          {product.compareAtPrice && <s>{money(product.compareAtPrice)}</s>}
        </p>
      </div>
    </Link>
  );
}
