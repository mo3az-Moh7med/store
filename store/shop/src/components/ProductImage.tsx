import type { Product } from "@/data/products";

export default function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  const src = product.images[0];
  if (src) {
    return <img src={src} alt={product.name} className={`img ${className}`} loading="lazy" />;
  }
  return (
    <div className={`img placeholder ${className}`} role="img" aria-label={product.name}>
      <span>{product.name}</span>
    </div>
  );
}
