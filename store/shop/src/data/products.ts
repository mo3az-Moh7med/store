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

// ملحوظة: الأسعار والمخزون والألوان هنا تقديرية ومؤقتة لحد ما يتحدد التسعير الفعلي. عدّلها قبل الإطلاق.
export const products: Product[] = [
  {
    slug: "baby-blanket-fleece",
    name: "بيبي بلانكت بولار",
    description:
      "دفا وخفة وحرية. بطانية بيبي طبقة واحدة ناعمة جدًا على بشرة طفلك وبتديله الدفا اللي محتاجه. وزن خفيف ودفا عالي وتنفع في أي مكان. غسيل بمياه باردة على دورة هادية، وتنشيف على حرارة هادية، ومن غير سوفتنر.",
    price: 350, // تقديري
    category: "بطاطين",
    images: ["/products/baby-blanket-fleece-1.jpg", "/products/baby-blanket-fleece-2.jpg"],
    colors: [{ name: "الأساسي", hex: "#f3efe8" }],
    variants: stockGrid(["الأساسي"], ["مقاس واحد"], 10), // مخزون تقديري
  },
  {
    slug: "baby-blanket-double",
    name: "بيبي بلانكت طبقتين",
    description:
      "نعومة القطن من بره، ودفا الفرو من جوه. الحضن الدافئ اللي البيبي محتاجه في أول شهوره. مزيج مثالي من القطن الناعم والفرو الدافئ. غسيل بمياه باردة على دورة هادية، وتنشيف على حرارة هادية، ومن غير سوفتنر.",
    price: 550, // تقديري
    category: "بطاطين",
    images: ["/products/baby-blanket-double-1.jpg", "/products/baby-blanket-double-2.jpg"],
    colors: [{ name: "الأساسي", hex: "#f3efe8" }],
    variants: stockGrid(["الأساسي"], ["مقاس واحد"], 10), // مخزون تقديري
  },
  {
    slug: "nursing-cover",
    name: "ساتر رضاعة",
    description:
      "ألوان هادية ما تزعجش البيبي. شبكة علشان يفضل مطمن وهو شايفك. حزام علشان تظبطي المقاس وتضمني الخصوصية.",
    price: 250, // تقديري
    category: "مستلزمات الرضاعة",
    images: ["/products/nursing-cover-1.jpg"],
    colors: [{ name: "الأساسي", hex: "#f3efe8" }],
    variants: stockGrid(["الأساسي"], ["مقاس واحد"], 10), // مخزون تقديري
  },
  {
    slug: "baby-slippers-booties",
    name: "جزم وشرابات بيبي",
    description: "جزم وشرابات بيبي ناعمة ودافية لرجلين صغيرة. خامة مريحة وبطانة فرو من جوه.",
    price: 200, // تقديري
    category: "أحذية وشرابات",
    images: ["/products/baby-slippers-booties-1.jpg", "/products/baby-slippers-booties-2.jpg"],
    colors: [{ name: "الأساسي", hex: "#f3efe8" }],
    variants: stockGrid(["الأساسي"], ["مقاس واحد"], 10), // مخزون تقديري
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

