// =====================================================================
// ملف المنتجات: ده المكان الوحيد اللي بتعدّل فيه. عدّل وارفع (git push) والموقع يتحدّث.
//
// - price: بالجنيه المصري (رقم صحيح). compareAtPrice: السعر قبل الخصم (اختياري).
// - images: حط الصور في public/products/ واكتب المسار هنا، مثال: "/products/tshirt-1.jpg"
//   (لو سيبتها فاضية هيظهر مكان الصورة رمادي مع اسم المنتج).
// - variants: كل مقاس + لون وعدد القطع المتاحة (stock). stock: 0 يعني خلصان.
// - اسم اللون في variants لازم يطابق اسمه في colors بالحرف.
// - الداتا دي أمثلة: امسحها وحط منتجاتك.
//
// ملحوظة: المخزون هنا بيتعدّل يدويًا. بعد ما تبيع قطع عدّل الأرقام وارفع.
// =====================================================================

export type Color = { name: string; hex: string };
export type Variant = { size: string; color: string; stock: number };
export type Product = {
  slug: string; // في الرابط: /products/<slug> (إنجليزي صغير وشرطات بس)
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: string[];
  colors: Color[];
  variants: Variant[];
};

// مساعد: يعمل كل تركيبات (لون × مقاس) بنفس المخزون. لو عايز مخزون مختلف لكل واحدة اكتبها يدوي.
function stockGrid(colors: string[], sizes: string[], stock: number): Variant[] {
  return colors.flatMap((color) => sizes.map((size) => ({ size, color, stock })));
}

export const products: Product[] = [
  {
    slug: "basic-cotton-tshirt",
    name: "تيشيرت قطن أساسي",
    description:
      "تيشيرت قطن 100% بقصة مريحة وخامة ناعمة بتستحمل الغسيل. مناسب للخروج واليوم العادي.",
    price: 350,
    compareAtPrice: 450,
    category: "تيشيرتات",
    images: [],
    colors: [
      { name: "أبيض", hex: "#ffffff" },
      { name: "أسود", hex: "#111111" },
      { name: "بيج", hex: "#d8c8b0" },
    ],
    variants: stockGrid(["أبيض", "أسود", "بيج"], ["S", "M", "L", "XL"], 10),
  },
  {
    slug: "oversize-hoodie",
    name: "هودي أوفر سايز",
    description:
      "هودي شتوي بقصة أوفر سايز وداخل مبطّن بخامة دافية. جيب أمامي وكاب بحبل.",
    price: 650,
    category: "هوديز",
    images: [],
    colors: [
      { name: "رمادي", hex: "#9ca3af" },
      { name: "أسود", hex: "#111111" },
    ],
    // مثال لمخزون مختلف لكل مقاس ولون:
    variants: [
      { size: "M", color: "رمادي", stock: 5 },
      { size: "L", color: "رمادي", stock: 2 },
      { size: "XL", color: "رمادي", stock: 0 },
      { size: "M", color: "أسود", stock: 8 },
      { size: "L", color: "أسود", stock: 6 },
      { size: "XL", color: "أسود", stock: 3 },
    ],
  },
  {
    slug: "straight-jeans",
    name: "بنطلون جينز مستقيم",
    description: "جينز بقصة مستقيمة وخامة سميكة شوية بتفضل محافظة على شكلها.",
    price: 750,
    category: "بناطيل",
    images: [],
    colors: [
      { name: "أزرق", hex: "#3b5b8a" },
      { name: "أسود", hex: "#111111" },
    ],
    variants: stockGrid(["أزرق", "أسود"], ["30", "32", "34", "36"], 6),
  },
  {
    slug: "light-jacket",
    name: "جاكيت خفيف",
    description: "جاكيت خفيف لنص الموسم، بسوستة وجيبين جانبيين، مقاوم للهواء.",
    price: 900,
    compareAtPrice: 1100,
    category: "جاكيتات",
    images: [],
    colors: [{ name: "زيتي", hex: "#556b2f" }],
    variants: stockGrid(["زيتي"], ["M", "L", "XL"], 4),
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getVariant(product: Product, size: string, color: string): Variant | undefined {
  return product.variants.find((v) => v.size === size && v.color === color);
}

export function totalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}
